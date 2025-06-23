# CLARITY
[https://connorjlink.com/clarity](https://connorjlink.com/clarity)

A complement to my custom programming language compiler, [haze](https://github.com/connorjlink/haze), _clarity_ offers a visual presentation of the stages and transformations of the compilation process, from source code level through AST and IR symbols down to bare-metal machine code and then platform-dependent native executable files (i.e., Windows PE .exe). Clarity includes a fully-custom source code editor powered by hazels-client (Typescript Web frontend) and hazels-server (node.js backend) seen in this repository, just two constituents of my custom language server for the _haze_ compiler.

## Technical Details
The source editor interfaces with the language server client to request and receive processed symbol information to update the web DOM and provide real-time syntax and semantic highlighting for Haze source code. The client liasons with hazels-server over a persistent WebSocket connection using my own custom JSON-RPC–inspired protocol to track document versions and peridiocally synchronize symbol information with surgical precision for maximum performance--information transmits and updates only as absolutely necessary. The node.js backend maintains a symbol database cache with several model representations for efficient queries and rapid response time to language server client symbol requests. It provides basic syntax highlighting information, including but not limited to keywords, literals, and operators, whilst it subprocesses the native C++ compiler executable to compute "real" complex semantic highlighting information for macros, variables, functions, and more on the fly. I designed both the compiler and language server sever around error detection and correction with the abililty to panic-recover from extremely abnormal states and continue to provide realisitic and meaningful symbol information. 

Since the C++ compiler runs as a separate process and communicates over an stdout stream pipe to hazels-server, it supports a wide variety of run modes and instrumentation designed to facilitate flexible requests for stage-specific information. For example, it permits AST-only builds, skipping executable generation to hasten object code output, and a reduced-accuracy "fuzzy" mode to find latch keypoints between which to interpolate symbol information in extreme panic cases--nested incomplete declarations, among others.

## More Information
The project remains in its infancy and will mature in its scope and goals in due time. For now, my primary goals follow as such:
 - [ ] Powerful data visualization over the stages of compilation (source, preprocessed?, AST, IR, ocode, and exe)
 - [ ] Complete source editor and language server client running locally in-browser

One of my long-term ideas includes running the full-stack setup in-browser hosted on my GitHub pages site. This will involve at a minimum:
 - [ ] Targeting WASM output from the Haze compiler (automated through GitHub actions?)
 - [ ] Projecting the hazels-server as a less-standalone JS environment
