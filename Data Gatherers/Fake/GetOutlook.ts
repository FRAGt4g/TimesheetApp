import { Gatherer, initData } from "./_layout"
// import OutlookKeys from "../Secrets/OutlookKeys.json"


const GatherOutlook: Gatherer = initData({
    title: "Gather Outlook...",
    gatherFunc: () => ({
        status: "finished",
        gatherType: "Outlook",
        information: {
            hi: "testing"
        }
    })
})

export default GatherOutlook