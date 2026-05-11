import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { 
    Bold, Italic, Underline as UnderlineIcon, 
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Link as LinkIcon, Unlink,
    Type, Palette, ChevronDown, RotateCcw,
    RotateCw,
    Type as TypeIcon, Eraser, CaseUpper,
    Variable, Quote, Highlighter, Sparkles,
    Eye, EyeOff, Loader2
} from "lucide-react";
import { cn, getSmartGreeting, getFirstName, getLastName } from "@/shared/lib/utils";
import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { normalizeEmailBodyHtml } from "@/shared/lib/email-format";
import { apiPath } from "@/frontend/lib/app-path";

// Custom Font Size Extension
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        }
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element: HTMLElement) => element.style.fontSize,
                        renderHTML: (attributes: any) => {
                            if (!attributes.fontSize) return {}
                            return { style: `font-size: ${attributes.fontSize}` }
                        },
                    },
                },
            },
        ]
    },
    addCommands(): any {
        return {
            setFontSize: (fontSize: string) => ({ chain }: any) => {
                return (chain() as any).setMark('textStyle', { fontSize }).run()
            },
            unsetFontSize: () => ({ chain }: any) => {
                return (chain() as any).setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
            },
        }
    },
})

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    onSave?: () => void;
    onSend?: () => void;
    placeholder?: string;
    sampleData?: any; // To power live preview
}

function notifyAiRoutingStatus(aiRouting: any) {
    if (!aiRouting) return;
    if (aiRouting.providerUsed === "openrouter" && aiRouting.fallbackActive) {
        const retryAt = aiRouting.groqRetryAt
            ? new Date(aiRouting.groqRetryAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : null;
        toast.info(
            retryAt
                ? `Using backup AI engine. Groq auto-retry after ${retryAt}.`
                : "Using backup AI engine. Groq will auto-retry shortly."
        );
    } else if (aiRouting.providerUsed === "groq" && !aiRouting.fallbackActive) {
        toast.success("Primary AI engine active.");
    }
}

export function RichTextEditor({ content, onChange, onSave, onSend, placeholder, sampleData }: RichTextEditorProps) {
    const [isRefining, setIsRefining] = useState(false);
    const [showMagicMenu, setShowMagicMenu] = useState(false);
    const [isLivePreview, setIsLivePreview] = useState(false);
    const [historyState, setHistoryState] = useState({ index: 0, length: 1 });

    // Snapshot history so Undo works back to the very first email
    const historyRef = useRef<string[]>([normalizeEmailBodyHtml(content || "")]);
    const historyIndexRef = useRef<number>(0);
    const isApplyingHistoryRef = useRef<boolean>(false);
    const lastRecordedRef = useRef<string>(normalizeEmailBodyHtml(content || ""));

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                link: false,
                underline: false,
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            FontFamily,
            Color,
            FontSize,
            Highlight.configure({ multicolor: true }),
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);

            if (isApplyingHistoryRef.current) return;
            if (html === lastRecordedRef.current) return;

            // If user edited after undoing, drop redo tail
            if (historyIndexRef.current < historyRef.current.length - 1) {
                historyRef.current.splice(historyIndexRef.current + 1);
            }

            historyRef.current.push(html);
            historyIndexRef.current = historyRef.current.length - 1;
            lastRecordedRef.current = html;
            setHistoryState({ index: historyIndexRef.current, length: historyRef.current.length });
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-8 text-slate-800',
            },
        },
    });

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                onSave?.();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                onSend?.();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSave, onSend]);

    // Reset history only when upstream content truly changes (new email loaded).
    // Parent components re-pass `content` on every keystroke; we must NOT reset then.
    useEffect(() => {
        if (!editor) return;
        const normalized = normalizeEmailBodyHtml(content || "");
        // If the parent is just reflecting our latest change, do nothing.
        if (normalized.trim() === lastRecordedRef.current.trim()) return;

        const current = editor.getHTML();
        const isDifferent = normalized.trim() !== current.trim();

        if (isDifferent) {
            isApplyingHistoryRef.current = true;
            editor.commands.setContent(normalized);
            isApplyingHistoryRef.current = false;
        }

        historyRef.current.splice(0, historyRef.current.length, normalized);
        historyIndexRef.current = 0;
        lastRecordedRef.current = normalized;
        setHistoryState({ index: 0, length: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content, editor]);

    // Smart Sync: When live preview is on, we don't change the underlying HTML, 
    // but the editor's visual state is managed via this effect if we were doing decorations.
    // For simplicity and "Awesome" results, we'll use a dynamic overlay or a temporary swap.
    
    const handleRefine = async (command: string, useFullBody = false) => {
        if (!editor) return;
        
        let textToRefine = "";
        let from = 0;
        let to = 0;
        let isFullBody = useFullBody;

        if (!isFullBody) {
            const sel = editor.state.selection;
            from = sel.from;
            to = sel.to;
            textToRefine = editor.state.doc.textBetween(from, to, ' ');
        }

        // If no selection and not explicitly full body, use the full editor content
        if (!textToRefine || textToRefine.length < 5) {
            isFullBody = true;
            textToRefine = editor.getHTML();
        }

        if (!textToRefine || textToRefine.length < 5) {
            toast.error("No content to refine. Write or select some text first.");
            return;
        }

        setIsRefining(true);
        setShowMagicMenu(false);
        try {
            const res = await fetch(apiPath("/campaigns/refine"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textToRefine, command })
            });
            const data = await res.json();
            if (data.success) {
                notifyAiRoutingStatus(data.data?.aiRouting);
                if (isFullBody) {
                    const normalized = normalizeEmailBodyHtml(data.data.refinedText);
                    isApplyingHistoryRef.current = true;
                    editor.commands.setContent(normalized);
                    isApplyingHistoryRef.current = false;
                    onChange(normalized);

                    if (normalized !== lastRecordedRef.current) {
                        if (historyIndexRef.current < historyRef.current.length - 1) {
                            historyRef.current.splice(historyIndexRef.current + 1);
                        }
                        historyRef.current.push(normalized);
                        historyIndexRef.current = historyRef.current.length - 1;
                        lastRecordedRef.current = normalized;
                        setHistoryState({ index: historyIndexRef.current, length: historyRef.current.length });
                    }
                } else {
                    const normalized = normalizeEmailBodyHtml(data.data.refinedText);
                    editor.chain().focus().insertContentAt({ from, to }, normalized).run();
                }
                toast.success("✨ AI Refinement applied!");
            } else {
                toast.error("AI couldn't process the refinement.");
            }
        } catch (err) {
            toast.error("Connection interrupted.");
        } finally {
            setIsRefining(false);
        }
    };

    if (!editor) return null;

    const handleUndo = () => {
        if (!editor) return;
        if (historyIndexRef.current <= 0) return;

        const nextIndex = historyIndexRef.current - 1;
        const snapshot = historyRef.current[nextIndex];
        isApplyingHistoryRef.current = true;
        editor.commands.setContent(snapshot);
        isApplyingHistoryRef.current = false;
        historyIndexRef.current = nextIndex;
        lastRecordedRef.current = snapshot;
        onChange(snapshot);
        setHistoryState({ index: historyIndexRef.current, length: historyRef.current.length });
    };

    const handleRedo = () => {
        if (!editor) return;
        if (historyIndexRef.current >= historyRef.current.length - 1) return;

        const nextIndex = historyIndexRef.current + 1;
        const snapshot = historyRef.current[nextIndex];
        isApplyingHistoryRef.current = true;
        editor.commands.setContent(snapshot);
        isApplyingHistoryRef.current = false;
        historyIndexRef.current = nextIndex;
        lastRecordedRef.current = snapshot;
        onChange(snapshot);
        setHistoryState({ index: historyIndexRef.current, length: historyRef.current.length });
    };

    const insertVariable = (variable: string) => {
        editor.chain().focus().insertContent(`{{${variable}}}`).run();
    };

    const toggleLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter Hyperlink URL:', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    // Ultra-Smart: Live Preview Token Processor
    const getLiveContent = () => {
        if (!isLivePreview || !sampleData) return content;
        let processed = content;
        
        const now = new Date();
        const onboardDate = sampleData.clientAddedOn ? new Date(sampleData.clientAddedOn) : null;

        const variables: Record<string, string> = {
            greeting: getSmartGreeting(sampleData.contactPerson || sampleData.poc, {
                email: sampleData.email,
                signature: sampleData.emailSignature || sampleData.signature || sampleData.signatureName,
            }),
            firstName: getFirstName(sampleData.contactPerson || sampleData.poc) || "there",
            lastName: getLastName(sampleData.contactPerson || sampleData.poc) || "",
            fullName: sampleData.contactPerson || sampleData.poc || "Valued Partner",
            companyName: sampleData.clientName || "your organization",
            industry: sampleData.industry || "your industry",
            services: sampleData.invoiceServiceNames || "your current offering",
            location: sampleData.address || "your team",
            relationship: sampleData.relationshipLevel || "our partnership",
            tenureYears: onboardDate ? (now.getFullYear() - onboardDate.getFullYear()).toString() : "0",
            onboardDate: onboardDate ? onboardDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "the start of our journey",
            currentDate: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        };

        Object.entries(variables).forEach(([key, val]) => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
            processed = processed.replace(regex, `<span class="bg-blue-50 text-blue-700 px-1 rounded font-bold border border-blue-200">${val}</span>`);
        });
        return processed;
    };

    // Magic Pen categorized options
    const magicPenCategories = [
        {
            title: "✍️ Tone & Voice",
            items: [
                { label: "Make Professional", cmd: "Rewrite to be more formal and executive. Use polished business language suitable for C-level communication." },
                { label: "Make Persuasive", cmd: "Add a subtle, strategic push for action. Use persuasion techniques like social proof, urgency, and value highlight." },
                { label: "Make Friendly & Warm", cmd: "Rewrite in a warm, approachable, and friendly tone while maintaining professionalism. Make it feel personal." },
                { label: "Make Confident & Bold", cmd: "Rewrite with strong, authoritative language. Show expertise and confidence without being arrogant." },
            ]
        },
        {
            title: "📐 Structure & Length",
            items: [
                { label: "Shorten & Punchy", cmd: "Drastically shorten into 1-2 impactful sentences. Keep only the most critical point." },
                { label: "Expand with Details", cmd: "Expand with more context, supporting detail, and examples while maintaining the core message." },
                { label: "Add Bullet Points", cmd: "Restructure into clean bullet points for easier scanning. Keep each bullet concise." },
                { label: "Format as Paragraphs", cmd: "Convert any lists or cluttered text into well-structured, flowing paragraphs with smooth transitions." },
            ]
        },
        {
            title: "🎯 Content Enhancement",
            items: [
                { label: "Fix Grammar & Spelling", cmd: "Fix all grammar, spelling, and punctuation errors. Do NOT change the meaning or tone." },
                { label: "Add Social Proof", cmd: "Weave in subtle social proof elements like industry trends, success metrics, or credibility signals." },
                { label: "Strengthen the CTA", cmd: "Make the call-to-action much stronger and more compelling. Create urgency without being pushy." },
                { label: "Add a P.S. Line", cmd: "Add a compelling P.S. line at the end that reinforces the key benefit or creates gentle urgency." },
            ]
        },
        {
            title: "🔄 Full Email Operations",
            fullBody: true,
            items: [
                { label: "Rewrite Entire Email", cmd: "Completely rewrite this email to be more engaging, professional, and conversion-oriented while preserving all {{variable}} placeholders and the core message." },
                { label: "Improve Flow & Readability", cmd: "Improve the overall flow, transitions, and readability of the entire email. Make it effortless to read." },
                { label: "Make More Concise", cmd: "Cut the entire email length by 40% while keeping the strongest points and all {{variable}} placeholders." },
                { label: "Add Emotional Hook", cmd: "Add an emotional opening hook and a compelling closing that creates connection. Preserve all {{variable}} placeholders." },
            ]
        }
    ];

    return (
        <div className="w-full border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xl ring-1 ring-slate-200/50">
                        <div className="flex items-center justify-between gap-1 p-1.5 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1">
                    {/* Group 1: AI Power */}
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
                        <div className="relative group/magic">
                            <button 
                                onClick={() => setShowMagicMenu(!showMagicMenu)}
                                disabled={isRefining}
                                className={cn(
                                    "flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all",
                                    isRefining 
                                        ? "bg-indigo-600 text-white animate-pulse" 
                                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                                )}
                                aria-label="AI Writing Assistant"
                            >
                                {isRefining ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                <span className="text-[9px] font-black uppercase tracking-[0.1em]">Improve</span>
                            </button>
                            
                            {showMagicMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowMagicMenu(false)} />
                                    <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-1.5 animate-in fade-in slide-in-from-top-1 max-h-[70vh] overflow-y-auto">
                                        <div className="px-3 py-2 mb-1 bg-indigo-50 rounded-xl border border-indigo-100">
                                            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.1em]">
                                                {editor.state.selection.from !== editor.state.selection.to 
                                                    ? "Selection detected"
                                                    : "Full body mode"}
                                            </p>
                                        </div>

                                        {magicPenCategories.map((cat, catIdx) => (
                                            <div key={cat.title}>
                                                {catIdx > 0 && <div className="border-t border-slate-100 my-1" />}
                                                <p className="text-[9px] font-black text-slate-400 px-3 pt-2 pb-1 uppercase tracking-tighter">{cat.title}</p>
                                                {cat.items.map(opt => (
                                                    <button 
                                                        key={opt.label}
                                                        onClick={() => handleRefine(opt.cmd, !!cat.fullBody)}
                                                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50 text-[11px] font-bold text-slate-700 hover:text-indigo-700 transition-all flex items-center gap-2 group"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors shrink-0" />
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="w-[1px] h-3 bg-slate-200 mx-0.5" />

                    {/* Group 2: Core Formatting */}
                    <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
                        <ToolbarButton 
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            active={editor.isActive('bold')}
                            icon={<Bold className="w-3 h-3" />}
                            title="Bold"
                        />
                        <ToolbarButton 
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            active={editor.isActive('italic')}
                            icon={<Italic className="w-3 h-3" />}
                            title="Italic"
                        />
                        <div className="w-[1px] h-2 bg-slate-100 mx-0.5" />
                        <ToolbarButton 
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            active={editor.isActive('bulletList')}
                            icon={<List className="w-3 h-3" />}
                            title="Bullet List"
                        />
                        <ToolbarButton 
                            onClick={toggleLink}
                            active={editor.isActive('link')}
                            icon={<LinkIcon className="w-3 h-3" />}
                            title="Link"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {/* Group 3: Intelligence */}
                    <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
                        <div className="relative group/vars">
                            <button 
                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white transition-all"
                            >
                                <Variable className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-[0.1em]">Add Data</span>
                            </button>
                            <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl opacity-0 invisible group-hover/vars:opacity-100 group-hover/vars:visible transition-all z-50 p-2 space-y-1">
                                {['greeting', 'firstName', 'lastName', 'fullName', 'companyName', 'industry', 'services', 'location', 'relationship'].map(v => (
                                    <button 
                                        key={v}
                                        onClick={() => insertVariable(v)}
                                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-[11px] font-bold text-slate-700 hover:text-blue-700 transition-colors"
                                    >
                                        {v === 'greeting' ? 'Smart Greeting' : v.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsLivePreview(!isLivePreview)}
                            className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all",
                                isLivePreview 
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                                    : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                            )}
                        >
                            {isLivePreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span className="text-[9px] font-black uppercase tracking-[0.1em]">Live Data</span>
                        </button>
                    </div>

                    <div className="w-[1px] h-3 bg-slate-200 mx-0.5" />

                    {/* Group 4: History (Compact) */}
                    <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
                        <ToolbarButton 
                            onClick={handleUndo}
                            disabled={historyState.index <= 0}
                            icon={<RotateCcw className="w-3 h-3" />}
                            title="Undo"
                        />
                        <ToolbarButton 
                            onClick={handleRedo}
                            disabled={historyState.index >= historyState.length - 1}
                            icon={<RotateCw className="w-3 h-3" />}
                            title="Redo"
                        />
                    </div>
                </div>
            </div>

            {/* Editor Area */}
            <div className="bg-white relative min-h-[400px]">
                {isLivePreview ? (
                    <div 
                        className="prose prose-sm max-w-none min-h-[400px] p-8 text-slate-800 bg-slate-50/30 cursor-not-allowed"
                        dangerouslySetInnerHTML={{ __html: getLiveContent() }}
                    />
                ) : (
                    <EditorContent editor={editor} />
                )}
                
                {!content && placeholder && !isLivePreview && (
                    <div className="absolute top-8 left-10 pointer-events-none text-slate-300 font-medium italic text-base">
                        {placeholder}
                    </div>
                )}
                
                {isLivePreview && (
                    <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-200 shadow-sm animate-pulse">
                        Previewing Live Data
                    </div>
                )}
            </div>
        </div>
    );
}

function ToolbarButton({ onClick, active, disabled, icon, title }: { 
    onClick: () => void; 
    active?: boolean; 
    disabled?: boolean;
    icon: React.ReactNode;
    title: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                "p-1.5 sm:p-2 rounded-lg transition-all duration-200 flex items-center justify-center border-2 border-transparent",
                active 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200 border-blue-600" 
                    : "text-slate-500 hover:bg-white hover:border-slate-200 hover:text-slate-900",
                disabled && "opacity-30 cursor-not-allowed"
            )}
        >
            {icon}
        </button>
    );
}
