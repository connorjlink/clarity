<script lang="ts">
    import ArticleSelector from "./ArticleSelector.svelte";

    const articles = [
        {
            header: {
                title: "Preprocessor",
                subtitle: "The definition of micro-managing macros",
                text: "Pp",
                size: "64",
                shadowColor: "var(--preprocessor-color-shadow)",
                foregroundTopColor: "var(--preprocessor-color-foreground-top)",
                foregroundBottomColor: "var(--preprocessor-color-foreground-bottom)",
                backgroundTopColor: "var(--preprocessor-color-background-top)",
                backgroundBottomColor: "var(--preprocessor-color-background-bottom)"
            },
            content: /*html*/`
                <p>Example preprocessor article content.</p>
            `
        },
        {
            header: {
                title: "Lexical Analysis",
                subtitle: "Read it and reap: scanning between the lines.",
                text: "Lx",
                size: "64",
                shadowColor: "var(--lexer-color-shadow)",
                foregroundTopColor: "var(--lexer-color-foreground-top)",
                foregroundBottomColor: "var(--lexer-color-foreground-bottom)",
                backgroundTopColor: "var(--lexer-color-background-top)",
                backgroundBottomColor: "var(--lexer-color-background-bottom)"
            },
            content: /*html*/`
                <p>Example lexer article content.</p>
            `
        },
        {
            header: {
                title: "Parsing",
                subtitle: "A spiraling descent into where things began.",
                text: "Pa",
                size: "64",
                shadowColor: "var(--parser-color-shadow)",
                foregroundTopColor: "var(--parser-color-foreground-top)",
                foregroundBottomColor: "var(--parser-color-foreground-bottom)",
                backgroundTopColor: "var(--parser-color-background-top)",
                backgroundBottomColor: "var(--parser-color-background-bottom)"
            },
            content: /*html*/`
                <p>Example parsing article content.</p>
            `
        },
        {
            header: {
                title: "Abstract Syntax Tree Optimization",
                subtitle: "Miss the forest for the trees no more.",
                text: "As",
                size: "64",
                shadowColor: "var(--ast-color-shadow)",
                foregroundTopColor: "var(--ast-color-foreground-top)",
                foregroundBottomColor: "var(--ast-color-foreground-bottom)",
                backgroundTopColor: "var(--ast-color-background-top)",
                backgroundBottomColor: "var(--ast-color-background-bottom)"
            },
            content: /*html*/`
                <p>Example AST article content.</p>
            `
        },
        {
            header: {
                title: "IR Code Generation",
                subtitle: "Distilled semantics. 200 proof(s).",
                text: "Ir",
                size: "64",
                shadowColor: "var(--ir-color-shadow)",
                foregroundTopColor: "var(--ir-color-foreground-top)",
                foregroundBottomColor: "var(--ir-color-foreground-bottom)",
                backgroundTopColor: "var(--ir-color-background-top)",
                backgroundBottomColor: "var(--ir-color-background-bottom)"
            },
            content: /*html*/`
                <p>Example IR article content.</p>
            `
        },
        {
            header: {
                title: "Three-Address Code Optimization",
                subtitle: "Less is more.",
                text: "To",
                size: "64",
                shadowColor: "var(--tac-color-shadow)",
                foregroundTopColor: "var(--tac-color-foreground-top)",
                foregroundBottomColor: "var(--tac-color-foreground-bottom)",
                backgroundTopColor: "var(--tac-color-background-top)",
                backgroundBottomColor: "var(--tac-color-background-bottom)"
            },
            content: /*html*/`
                <p>Example TAC article content.</p>
            `
        },
        {
            header: {
                title: "x86 Code Generation",
                subtitle: "An unspoken archaic dialect understood only by pedants.",
                text: "Cg",
                size: "64",
                shadowColor: "var(--codegen-color-shadow)",
                foregroundTopColor: "var(--codegen-color-foreground-top)",
                foregroundBottomColor: "var(--codegen-color-foreground-bottom)",
                backgroundTopColor: "var(--codegen-color-background-top)",
                backgroundBottomColor: "var(--codegen-color-background-bottom)"
            },
            content: /*html*/`
                <p>Example x86 code generation article content.</p>
            `
        },
        {
            header: {
                title: "Peephole Optimization",
                subtitle: "Seeing the bigger picture through a tiny window.",
                text: "Po",
                size: "64",
                shadowColor: "var(--peephole-color-shadow)",
                foregroundTopColor: "var(--peephole-color-foreground-top)",
                foregroundBottomColor: "var(--peephole-color-foreground-bottom)",
                backgroundTopColor: "var(--peephole-color-background-top)",
                backgroundBottomColor: "var(--peephole-color-background-bottom)"
            },
            content: /*html*/`
                <p>Example peephole optimization article content.</p>
            `
        },
        {
            header: {
                title: "Translation Unit Linking",
                subtitle: "Here's my address, so call me, maybe.",
                text: "Tu",
                size: "64",
                shadowColor: "var(--link-color-shadow)",
                foregroundTopColor: "var(--link-color-foreground-top)",
                foregroundBottomColor: "var(--link-color-foreground-bottom)",
                backgroundTopColor: "var(--link-color-background-top)",
                backgroundBottomColor: "var(--link-color-background-bottom)"
            },
            content: /*html*/`
                <p>Example translation unit linking article content.</p>
            `
        },
        {
            header: {
                title: "Link-Time Optimization",
                subtitle: "Caching in on visibility without bound.",
                text: "Li",
                size: "64",
                shadowColor: "var(--lto-color-shadow)",
                foregroundTopColor: "var(--lto-color-foreground-top)",
                foregroundBottomColor: "var(--lto-color-foreground-bottom)",
                backgroundTopColor: "var(--lto-color-background-top)",
                backgroundBottomColor: "var(--lto-color-background-bottom)"
            },
            content: /*html*/`
                <p>Example LTO article content.</p>
            `
        },
        {
            header: {
                title: "Executable Exporting",
                subtitle: "Fossilizing fresh code in the sediment of antiquity.",
                text: "Ex",
                size: "64",
                shadowColor: "var(--executable-color-shadow)",
                foregroundTopColor: "var(--executable-color-foreground-top)",
                foregroundBottomColor: "var(--executable-color-foreground-bottom)",
                backgroundTopColor: "var(--executable-color-background-top)",
                backgroundBottomColor: "var(--executable-color-background-bottom)"
            },
            content: /*html*/`
                <h2>Section 0</h2>
                <blockquote class="shadowed">
                    <p>Please mind the gap between the code and the platform.</p>
                </blockquote>
                <p>While generating object code and linking translation units are no simple feat, operating systems ostensibly conspire to make the last step, packaging an executable, even more complicated and infuriating. Executable formats, be they ELF, PE, Mach-O or even the archaic a.out, are data structures that require a deep understanding of the program at hand, the operating system's loader, and&mdash;especially for Windows&mdash;the dynamic linker. For time limitations and brevity purposes, I focus solely on x86 Windows development for this series and the Haze compiler.</p>
                <hr>

                <h2>Section 1</h2>
                <blockquote class="shadowed">
                    <p>This program cannot be run in DOS mode.</p>
                </blockquote>
                <p>Windows PE&mdash;<i>Portable Executable</i>, not to be confused with <a href="https://en.wikipedia.org/wiki/Windows_Preinstallation_Environment"><i>Pre-installation Environment</i></a> also abbreviated PE&mdash;suffers many shortfalls inherent to an API designed in the early '90s. Indeed, PE traces roots to the <a href="https://en.wikipedia.org/wiki/New_Executable"><i>New Exectuable</i></a> format pioneered by Windows 1.0 hailing from the mid-'80s and borrows design from the UNIX-oriented <a href="https://en.wikipedia.org/wiki/COFF"><i>Common Object File Format</i></a>. For its vintage, PE has aged well and proven remarkably extensible, carrying program compatibility through 16-bit, 32-bit, and 64-bit incarnations; however, cracks have begun to surface en masse and now mar the otherwise silky smooth surface of modern programs with indellible reminders of yesteryear's technology: MIPS compatibility, bound imports, and the deprecated COFF symbol table, among others.</p>

                <p>During this time, software needs, usage, and build tools have changed dramatically, but the unending commitment to backwards compatibility leaves forlorn relics of forgotten times in modern executables. A few such examples follow.</p>

                <ol>
                    <li>
                        <h3>The <code>TimeDateStamp</code> Field</h3>
                        <p>Despite its name, this field in present usage does not (and according to <a href="https://devblogs.microsoft.com/oldnewthing/20240815-00/?p=110131">Raymond Chen</a>, <i>should not</i>) store any kind of timestamp owing to build reproducibility concerns. Instead, developers typically omit or otherwise ignore the field and populate it with a compile hash that remains static for duplicate compilations of the same source, thereby preserving the overall EXE signature or hash.</p>
                    </li>
                    <li>
                        <h3>The <code>COM Descriptor Directory</code> Field</h3>
                        <p>Although native code&mdash;especially that expected to interface with Windows modules&mdash;uses COM extensively, it rarely requires the usage of this vestigial field. However, it remains present in the PE header for backwards compatibility, and has since re-emerged as a container specifier for the .NET Common Language Runtime (CLR) metadata storage.</p>
                    </li>
                    <li>
                        <h3>The <code>Bound Import</code> Table</h3>
                        <p>Once used as an optimization to pre-solve DLL addresses at link time, bound imports have fallen out of favor owing to their increase in complexity and limited utility. Since the advent of address space layout randomization (ASLR), pre-resolved imports immediately invalidate upon re-basing, which requires a secondary resolution nonetheless. The table remains as a deprecated entry in the COFF section for compatibility, but more modern techniques like delay-loading and dynamic linking supplant its usage with both improved security and performance.</p>
                    </li>
                </ol>

                <h2>Section 2</h2>
                <blockquote class="shadowed">
                    <p>Some assembly required.</p>
                </blockquote>
                <hr>

                <h2>Section 3</h2>
                <blockquote class="shadowed">
                    <p>You wouldn't steal a function...</p>
                </blockquote>   
            `
        }
    ];
</script>

<ArticleSelector {articles} />
