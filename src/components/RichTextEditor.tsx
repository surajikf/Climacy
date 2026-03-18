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
    Type as TypeIcon, Eraser, CaseUpper,
    Variable, Quote, Highlighter, Sparkles,
    Eye, EyeOff, Loader2
} from "lucide-react";
import { cn, getSmartGreeting, getFirstName, getLastName } from "@/lib/utils";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

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
    placeholder?: string;
    sampleData?: any; // To power live preview
}

export function RichTextEditor({ content, onChange, placeholder, sampleData }: RichTextEditorProps) {
    const [isRefining, setIsRefining] = useState(false);
    const [showMagicMenu, setShowMagicMenu] = useState(false);
    const [isLivePreview, setIsLivePreview] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
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
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-8 text-slate-800',
            },
        },
    });

    // Smart Sync: When live preview is on, we don't change the underlying HTML, 
    // but the editor's visual state is managed via this effect if we were doing decorations.
    // For simplicity and "Awesome" results, we'll use a dynamic overlay or a temporary swap.
    
    const handleRefine = async (command: string) => {
        if (!editor) return;
        
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, ' ');
        
        if (!selectedText || selectedText.length < 5) {
            toast.error("Please select a longer paragraph to refine.");
            return;
        }

        setIsRefining(true);
        setShowMagicMenu(false);
        try {
            const res = await fetch("/api/campaigns/refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: selectedText, command })
            });
            const data = await res.json();
            if (data.success) {
                editor.chain().focus().insertContentAt({ from, to }, data.data.refinedText).run();
                toast.success("AI Refinement applied!");
            } else {
                toast.error("AI couldn't process the refinement.");
            }
        } catch (err) {
            toast.error("Neural link interrupted.");
        } finally {
            setIsRefining(false);
        }
    };

    if (!editor) return null;

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
        const variables: Record<string, string> = {
            greeting: getSmartGreeting(sampleData.contactPerson),
            firstName: getFirstName(sampleData.contactPerson),
            lastName: getLastName(sampleData.contactPerson),
            fullName: sampleData.contactPerson || "Valued Partner",
            companyName: sampleData.clientName || "Acme Corp",
            industry: sampleData.industry || "SaaS",
            services: sampleData.invoiceServiceNames || "your business infrastructure",
            location: sampleData.address || "your headquarters",
            relationship: sampleData.relationshipLevel || "Valued Partner",
            tenureYears: ((new Date().getFullYear() - new Date(sampleData.clientAddedOn).getFullYear()) || "0").toString()
        };

        Object.entries(variables).forEach(([key, val]) => {
            // Case-insensitive replacement
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
            processed = processed.replace(regex, `<span class="bg-blue-50 text-blue-700 px-1 rounded font-bold border border-blue-200">${val}</span>`);
        });
        return processed;
    };

    return (
        <div className="w-full border-2 border-slate-100 rounded-2xl overflow-hidden bg-white shadow-xl ring-1 ring-slate-200/50">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-3 border-b-2 border-slate-50 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
                {/* History */}
                <div className="flex items-center border-r border-slate-200 pr-2 mr-1">
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        icon={<RotateCcw className="w-4 h-4" />}
                        title="Undo"
                    />
                </div>

                {/* Magic Pen AI Refiner */}
                <div className="flex items-center border-r border-slate-200 pr-2 mr-1">
                    <div className="relative group/magic">
                        <button 
                            onClick={() => setShowMagicMenu(!showMagicMenu)}
                            disabled={isRefining}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200",
                                isRefining && "animate-pulse"
                            )}
                        >
                            {isRefining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">Magic Pen</span>
                        </button>
                        
                        {showMagicMenu && (
                            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-1">
                                <p className="text-[9px] font-bold text-slate-400 px-2 pb-1 uppercase tracking-tighter">AI Refine Selection</p>
                                {[
                                    { label: "Make Professional", cmd: "Rewrite to be more formal and executive." },
                                    { label: "Make Persuasive", cmd: "Add a subtle, strategic push for action." },
                                    { label: "Shorten & Punchy", cmd: "Summarize this into 1-2 impactful sentences." },
                                    { label: "Change to Analytical", cmd: "Use data-driven, strategic vocabulary." }
                                ].map(opt => (
                                    <button 
                                        key={opt.label}
                                        onClick={() => handleRefine(opt.cmd)}
                                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-[11px] font-bold text-slate-700 hover:text-indigo-700 transition-colors"
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Typography Basic */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        active={editor.isActive('bold')}
                        icon={<Bold className="w-4 h-4" />}
                        title="Bold"
                    />
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        active={editor.isActive('italic')}
                        icon={<Italic className="w-4 h-4" />}
                        title="Italic"
                    />
                </div>

                {/* Font Size */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
                    <ToolbarButton 
                        onClick={() => (editor.chain() as any).focus().setFontSize('14px').run()}
                        active={editor.isActive('textStyle', { fontSize: '14px' })}
                        icon={<span className="text-[10px] font-bold">14</span>}
                        title="Small"
                    />
                    <ToolbarButton 
                        onClick={() => (editor.chain() as any).focus().setFontSize('18px').run()}
                        active={editor.isActive('textStyle', { fontSize: '18px' })}
                        icon={<span className="text-sm font-bold">18</span>}
                        title="Medium"
                    />
                    <ToolbarButton 
                        onClick={() => (editor.chain() as any).focus().setFontSize('26px').run()}
                        active={editor.isActive('textStyle', { fontSize: '26px' })}
                        icon={<span className="text-lg font-bold">26</span>}
                        title="Large"
                    />
                </div>

                {/* Alignment & Structure */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        active={editor.isActive({ textAlign: 'left' })}
                        icon={<AlignLeft className="w-4 h-4" />}
                        title="Align Left"
                    />
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        active={editor.isActive({ textAlign: 'center' })}
                        icon={<AlignCenter className="w-4 h-4" />}
                        title="Align Center"
                    />
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        active={editor.isActive('blockquote')}
                        icon={<Quote className="w-4 h-4" />}
                        title="Callout Block"
                    />
                </div>

                {/* Colors & Highlight */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
                        active={editor.isActive('highlight')}
                        icon={<Highlighter className="w-4 h-4 text-amber-500" />}
                        title="Highlight"
                    />
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().setColor('#2563eb').run()}
                        active={editor.isActive('textStyle', { color: '#2563eb' })}
                        icon={<CaseUpper className="w-4 h-4 text-blue-600" />}
                        title="Brand Color"
                    />
                </div>

                {/* Smart Variables */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
                     <div className="relative group/vars">
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all border border-slate-200 shadow-sm">
                            <Variable className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Add Data</span>
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl opacity-0 invisible group-hover/vars:opacity-100 group-hover/vars:visible transition-all z-50 p-2 space-y-1">
                            {['greeting', 'firstName', 'lastName', 'fullName', 'companyName', 'industry', 'services', 'location', 'relationship', 'tenureYears'].map(v => (
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
                </div>

                {/* Live Data Preview Toggle */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-1">
                    <button 
                        onClick={() => setIsLivePreview(!isLivePreview)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all border shadow-sm",
                            isLivePreview 
                                ? "bg-emerald-600 text-white border-emerald-700" 
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        )}
                    >
                        {isLivePreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Data</span>
                    </button>
                </div>

                {/* Links & Clear */}
                <div className="flex items-center gap-1">
                    <ToolbarButton 
                        onClick={toggleLink}
                        active={editor.isActive('link')}
                        icon={<LinkIcon className="w-4 h-4" />}
                        title="Insert Link"
                    />
                    <ToolbarButton 
                        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                        icon={<Eraser className="w-4 h-4 text-rose-500" />}
                        title="Clear Formatting"
                    />
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
                "p-2 rounded-lg transition-all duration-200 flex items-center justify-center border-2 border-transparent",
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
