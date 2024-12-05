import { Gatherer, initData } from "./_layout"

const GatherEmail: Gatherer = initData({
    title: "Gather Email...",
    gatherFunc: () => ({
        status: "testing",
        gatherType: "Email",
        information: {
            something: "value",
            other: {
                moreStuff: "value",
                hi: "value"
            }
        }
    })
})

export default GatherEmail