// Turns dsa-metro.html (the claude.ai artifact source, which has no document skeleton)
// into a standalone index.html for static hosting. Run: node build.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync(new URL('./dsa-metro.html', import.meta.url), 'utf8');
const cut = src.indexOf('</style>') + '</style>'.length;
if (cut < '</style>'.length) throw new Error('dsa-metro.html has no <style> block');

// title, fonts and styles go in <head>; the markup and script go in <body>
const head = src.slice(0, cut).replace(/<meta name="claude:viewport-fit-sides"[^>]*>\s*/, '');
const body = src.slice(cut).trim();

const description = 'Learn DSA from zero to dynamic programming on a metro map: 18 interactive stations, fill-the-DP-table games, and a beginner-to-advanced study guide with LeetCode, Codeforces, CSES and AtCoder problems.';
const icon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect x='2' y='17' width='36' height='6' rx='3' fill='%23142030'/%3E%3Ccircle cx='8' cy='20' r='5' fill='%23f0b400'/%3E%3Ccircle cx='16' cy='20' r='5' fill='%231b5bbf'/%3E%3Ccircle cx='24' cy='20' r='5' fill='%23cf3a2f'/%3E%3Ccircle cx='32' cy='20' r='5' fill='%23b8186f'/%3E%3C/svg%3E";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${description}">
<meta property="og:title" content="DSA Metro">
<meta property="og:description" content="${description}">
<meta property="og:type" content="website">
<link rel="icon" href="${icon}">
<style>[hidden]{display:none!important}img{max-width:100%}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
${head}
</head>
<body>
${body}
</body>
</html>
`;

writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('Wrote index.html (' + Math.round(html.length / 1024) + ' KB)');
