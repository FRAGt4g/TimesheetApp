import { DataShape, Gatherer, initData } from "../_layout"
import axios from 'axios';

const curryGetGithubUser = (username: string): () => Promise<DataShape> => {
    return async (): Promise<DataShape> => {
        try {
            const response = await axios.get(`https://api.github.com/users/${username}`);
            return {
                gatherType: "github",
                information: {
                    login: response.data.login,
                    followers: response.data.followers,
                    following: response.data.following,
                    html_url: response.data.html_url,
                    avatar_url: response.data.avatar_url
                }
            }
        }
        catch (error) {
            return {
                error: error instanceof Error ? error.message : "Unknown Error",
                gatherType: "github",
                information: {
                    login: null,
                    followers: null,
                    following: null,
                    html_url: null,
                    avatar_url: null
                }
            }
        }
    };
};




const GatherGithub: Gatherer = initData({
    title: "Gather Github User...",
    gatherFunc: curryGetGithubUser("FRAGt4g")
})

export default GatherGithub