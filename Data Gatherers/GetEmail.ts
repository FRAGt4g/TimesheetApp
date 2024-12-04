import { Gatherer, DataShape } from "./_layout"

const GatherEmail: Gatherer = {
    title: "Gather Email...",
    gatherFunc: () => {
        return {
            status: "testing",
            gatherType: "Email",
            information: {
                something: "value",
                other: {
                    moreStuff: "value",
                    hi: "value"
                }
            }
        }
    }
}

export default GatherEmail