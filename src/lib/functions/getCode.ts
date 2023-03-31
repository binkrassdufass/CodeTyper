import { Octokit, App } from "https://cdn.skypack.dev/octokit";
import { createText } from "./createText";
import type { LetterInterface } from "../../types/interfaces";
const octokit = new Octokit();

async function getRandomSourceCode(): Promise<LetterInterface[][][]> {
  // Generate a random query string to search for repositories

  // Search for repositories using the random query string
  while (true) {
    const randomKeywords = ["cool", "awesome", "amazing"];
    const randomKeyword =
      randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
    const repos = await octokit.rest.search.repos({
      q: `python ${randomKeyword} in:name`,
      sort: "stars",
      order: "desc",
      per_page: 1,
    });

    if (repos.data.items.length === 0) {
      continue;
    }

    // Get the first repository in the search result
    const repo = repos.data.items[0];
    const tree = await octokit.rest.git.getTree({
      owner: repo.owner.login,
      repo: repo.name,
      tree_sha: "HEAD", // get the tree of the latest commit
      recursive: true, // get the whole repository tree recursively
    });

    let sourceCodeFile;
    for (const file of tree.data.tree) {
      if (file.type === "blob" && file.path.endsWith(".py")) {
        sourceCodeFile = file;
        break; // stop searching once we find the first Svelte file
      }
    }

    if (sourceCodeFile === undefined) {
      continue;
    }

    // Get the file content
    const fileContent = await octokit.rest.repos.getContent({
      owner: repo.owner.login,
      repo: repo.name,
      path: sourceCodeFile.path,
    });

    // Convert the Base64 encoded content to a string

    const fileContentString = atob(fileContent.data.content);
    const decoder = new TextDecoder("utf-8");
    const sourceCode = decoder.decode(
      new Uint8Array([...fileContentString].map((char) => char.charCodeAt(0)))
    );

    let lines = sourceCode.split(/\r?\n/);
    lines = lines.map((line) => `${line} ↵`);
    const startLine = Math.floor(Math.random() * (lines.length - 10));

    // Get a slice of 7 lines starting from the random starting line
    const codeBlock = lines
      .slice(startLine, startLine + 10)
      .map((str) => str.replace(/^\s+/, ""));

    return createText(codeBlock);
  }
}

export default getRandomSourceCode;
