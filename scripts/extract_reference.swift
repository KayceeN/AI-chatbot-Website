#!/usr/bin/env swift
import Foundation
import AVFoundation
import AppKit
import Vision

struct FrameOCR {
    let timestamp: Double
    let imagePath: String
    let text: [String]
}

func usage() {
    fputs("Usage: extract_reference.swift <videoPath> <outputDir> [intervalSeconds]\n", stderr)
}

guard CommandLine.arguments.count >= 3 else {
    usage()
    exit(1)
}

let videoPath = CommandLine.arguments[1]
let outputDir = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
let interval = CommandLine.arguments.count >= 4 ? Double(CommandLine.arguments[3]) ?? 2.5 : 2.5

let fm = FileManager.default
let videoURL = URL(fileURLWithPath: videoPath)

guard fm.fileExists(atPath: videoURL.path) else {
    fputs("Video not found: \(videoURL.path)\n", stderr)
    exit(1)
}

try? fm.createDirectory(at: outputDir, withIntermediateDirectories: true)
let framesDir = outputDir.appendingPathComponent("frames", isDirectory: true)
try? fm.createDirectory(at: framesDir, withIntermediateDirectories: true)

let asset = AVURLAsset(url: videoURL)
let durationSeconds = CMTimeGetSeconds(asset.duration)

guard durationSeconds.isFinite, durationSeconds > 0 else {
    fputs("Invalid or unreadable video duration\n", stderr)
    exit(1)
}

let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.requestedTimeToleranceAfter = .zero
generator.requestedTimeToleranceBefore = .zero

func savePNG(_ cgImage: CGImage, to url: URL) throws {
    let rep = NSBitmapImageRep(cgImage: cgImage)
    guard let data = rep.representation(using: .png, properties: [:]) else {
        throw NSError(domain: "extract_reference", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to encode PNG"])
    }
    try data.write(to: url)
}

func ocrLines(from cgImage: CGImage) -> [String] {
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    request.recognitionLanguages = ["en-US"]

    let handler = VNImageRequestHandler(cgImage: cgImage)
    do {
        try handler.perform([request])
    } catch {
        return []
    }

    guard let observations = request.results else { return [] }
    let strings = observations.compactMap { $0.topCandidates(1).first?.string }
    return strings
}

var rows: [FrameOCR] = []
var index = 0
var t = 0.0

while t <= durationSeconds {
    let time = CMTime(seconds: t, preferredTimescale: 600)
    do {
        let cgImage = try generator.copyCGImage(at: time, actualTime: nil)
        let imageName = String(format: "frame_%04d_%06.2fs.png", index, t)
        let imageURL = framesDir.appendingPathComponent(imageName)
        try savePNG(cgImage, to: imageURL)
        let lines = ocrLines(from: cgImage)
        rows.append(FrameOCR(timestamp: t, imagePath: "frames/\(imageName)", text: lines))
    } catch {
        // Skip unreadable frame.
    }

    index += 1
    t += interval
}

let specURL = outputDir.appendingPathComponent("spec.md")
var md = "# Reference Spec\n\n"
md += "- Source: `\(videoURL.lastPathComponent)`\n"
md += String(format: "- Duration: %.2f seconds\n", durationSeconds)
md += String(format: "- Sampling interval: %.2f seconds\n\n", interval)
md += "## Frame OCR Dump\n\n"

for row in rows {
    md += String(format: "### t=%.2fs\n", row.timestamp)
    md += "- Frame: `\(row.imagePath)`\n"
    if row.text.isEmpty {
        md += "- OCR: _none_\n\n"
    } else {
        md += "- OCR:\n"
        for line in row.text {
            md += "  - \(line.replacingOccurrences(of: "\n", with: " "))\n"
        }
        md += "\n"
    }
}

try md.write(to: specURL, atomically: true, encoding: .utf8)
print("Wrote \(rows.count) frames and OCR to \(specURL.path)")
