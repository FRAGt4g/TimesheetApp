import { Gatherer, initData } from "./_layout"

const GatheriCloud: Gatherer = initData({
    title: "Gather iCloud...",
    gatherFunc: () => ({
        status: "done",
        gatherType: "iCloud",
        information: {
            other: {
                moreStuff: "value",
                hi: "value"
            }
        }
    })
})

export default GatheriCloud