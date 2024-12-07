import { Gatherer, initData, DataShape } from "../_layout"
// import OutlookKeys from "../Secrets/OutlookKeys.json"


const GatherOutlook: Gatherer = initData({
    title: "Gather Outlook...",
    gatherFunc: () => (new Promise<DataShape>(resolve => {
        setTimeout(() => {
            resolve({
                error: "failed!",
                gatherType: "Outlook",
                information: {
                    hi: "testing"
                }
            })
        }, 2000)
    }))
})

export default GatherOutlook