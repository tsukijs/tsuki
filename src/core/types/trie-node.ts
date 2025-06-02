//Trie Node representing a path segment

import type { RouteHandler } from "./handler";

export interface TrieNode {
    segment: string;
    children: Map<string, TrieNode>;
    handler?: RouteHandler;
    isParam: boolean;
    paramName?: string;
}