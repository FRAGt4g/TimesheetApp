import 'react-native-get-random-values';
import { v4 as UUID } from 'uuid';

type RowItem = {
    client: string,
    hours: number,
    billable: boolean,
    inputDate: Date,
    actionDate: Date,
    description: string,
    extraInfo: object
}

type Gatherer = {
    id: string,
    title: string,
    gatherFunc: () => Promise<DataShape>,
}

type DataShape = {
    error?: string,
    gatherType: string,
    rowData?: RowItem,
}

export const initData = ({ title, gatherFunc }: { 
    title: string, 
    gatherFunc: () => Promise<DataShape>,
}): Gatherer => ({
    id: UUID(),
    title: title,
    gatherFunc: gatherFunc,
})

export type { DataShape, Gatherer }