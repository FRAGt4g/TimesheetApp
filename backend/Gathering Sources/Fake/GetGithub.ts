import { DataShape, Gatherer, initData } from "../_layout"
import axios from 'axios';

async function getGitHubUser(username: string): Promise<DataShape> {
    let result: DataShape = { gatherType: "github" }
    async function getRowData() {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        return {
            client: response.data.login,
            hours: 0,
            billable: true,
            inputDate: new Date(),
            actionDate: new Date(),
            description: "",
            extraInfo: {
                followers: response.data.followers,
                following: response.data.following,
                html_url: response.data.html_url,
                avatar_url: response.data.avatar_url
            }
        }
    }

    try { result.rowData = await getRowData() }
    catch (error) { result.error = error instanceof Error ? error.message : "Unknown Error" }
    return result
}

const GatherGithub: Gatherer = initData({
    title: "Gather Github User...",
    gatherFunc: () => getGitHubUser("FRAGt4g")
})

export default GatherGithub