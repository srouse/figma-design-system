import {Octokit as Octokit$1} from "/-/@octokit/core@v4.0.4-hwgV7PzMcg3O1yYJZjEW/dist=es2019,mode=imports/optimized/@octokit/core.js";
import {requestLog} from "/-/@octokit/plugin-request-log@v1.0.4-xGy6dIGQ2bc0aPY0M8yh/dist=es2019,mode=imports/optimized/@octokit/plugin-request-log.js";
import {paginateRest} from "/-/@octokit/plugin-paginate-rest@v4.0.0-imRUgmDiFie01stPxvun/dist=es2019,mode=imports/optimized/@octokit/plugin-paginate-rest.js";
import {legacyRestEndpointMethods} from "/-/@octokit/plugin-rest-endpoint-methods@v6.3.0-HMXkZkiSDYrYk0rpavKa/dist=es2019,mode=imports/optimized/@octokit/plugin-rest-endpoint-methods.js";
const VERSION = "19.0.4";
const Octokit = Octokit$1.plugin(requestLog, legacyRestEndpointMethods, paginateRest).defaults({
  userAgent: `octokit-rest.js/${VERSION}`
});
export {Octokit};
export default null;
