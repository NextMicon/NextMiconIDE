// import { Octokit } from "octokit";
// import { Config } from "../config";

// const github_token = "";

// const octokit = new Octokit({ auth: github_token });

// const getRegistories = async () => {
//   const registories = await Promise.all(
//     Config.registory.map(({ url }) =>
//       fetch(url)
//         .then((res) => res.text())
//         .then((str) => JSON.parse(str)),
//     ),
//   );
//   return registories;
// };

// const githubApiTest = async () => {
//   console.log("=== GitHub Test ===");
//   console.log(await getRegistories());
//   console.log(await getTree());
//   console.log(await getGithubContent("NextMicon", "registory", "main", ["IO", "GPIO", "v0.0.0", "README.md"]));
//   console.log(await getGithubContent("NextMicon", "NextMiconIDE", "main", ["src", "ipckey.ts"]));
// };

// const getGithubId = () => octokit.rest.users.getAuthenticated().then(({ data }) => data.login);

// const getTree = async (
//   registory = { owner: "NextMicon", repo: "registory" },
//   path: string[] = [],
//   sha = "main",
// ): Promise<string[][]> => {
//   const {
//     data: { tree },
//   } = await octokit.request(`GET /repos/{owner}/{repo}/git/trees/{tree_sha}`, { ...registory, tree_sha: sha });

//   const ret = tree.flatMap(async (item) => {
//     if (item.type === "tree") return await getTree(registory, [...path, item.path ?? ""], item.sha);
//     if (item.type === "blob") return [[...path, item.path ?? ""]];
//     else return [];
//   });

//   return (await Promise.all(ret)).flat(1);
// };

// const getPackage = async (registory = { owner: "NextMicon", repo: "registory" }, directory = ["IO"]) => {
//   await octokit.request(`GET /repos/{owner}/{repo}/git/blobs/{file_sha}`);
// };

// const getGithubContent = async (owner: string, repo: string, branch: string, path: string[]) => {
//   const url = `https://raw.github.com/${owner}/${repo}/${branch}/${path.join("/")}`;
//   return fetch(url).then((res) => res.text());
// };
