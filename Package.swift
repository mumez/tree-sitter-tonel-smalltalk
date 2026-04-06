// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterTonelSmalltalk",
    products: [
        .library(name: "TreeSitterTonelSmalltalk", targets: ["TreeSitterTonelSmalltalk"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterTonelSmalltalk",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterTonelSmalltalkTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterTonelSmalltalk",
            ],
            path: "bindings/swift/TreeSitterTonelSmalltalkTests"
        )
    ],
    cLanguageStandard: .c11
)
