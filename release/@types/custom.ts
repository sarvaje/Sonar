import { Arguments } from 'yargs';

export type GitHubAuth = {
    user: string;
    pass: string;
    otp: string;
} | {
    token: string;
}

export type Tag = 'Docs' |
    'Build' |
    'Update' |
    'Upgrade' |
    'Chore' |
    'Fix' |
    'New' |
    'Breaking';

export type Author = {
    gitHubProfileURL: string;
    name: string;
}

export type Commit = {
    associatedIssues: string[];
    sha: string;
    tag: Tag;
    title: string;
    author: Author | null;
};

export type Package = {
    commits: Commit[];
    content: any;
    ignore: boolean;
    name: string;
    oldVersion: string;
    path: string;
    publishedVersion: string;
    references: string[];
    tested: boolean;
    updated: boolean;
}

export type Parameters = {
    ci: boolean;
    dryRun: boolean;
    force: boolean;
    help: boolean;
    justRelease: boolean;
    skipInstall: boolean;
    skipTests: boolean;
    skipVsce: boolean;
    testMode: boolean;
}

export type Reference = {
    path: string;
}

export type Context = {
    abort: boolean;
    argv: Arguments<Parameters>;
    error?: Error;
    packages: Map<string, Package>;
    sha: string;
}

export enum Bump {
    none,
    patch,
    minor,
    major
}
