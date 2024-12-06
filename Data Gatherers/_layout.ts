import 'react-native-get-random-values';
import { v4 as UUID } from 'uuid';

type Gatherer = {
    id: string,
    title: string,
    gatherFunc: () => Promise<DataShape>
}

type DataShape = {
    error?: string,
    gatherType: string,
    information: object,
}

export const initData = ({ 
    title, 
    gatherFunc 
}: { 
    title: string; 
    gatherFunc: () => Promise<DataShape>
}): Gatherer => ({
    id: UUID(),
    title: title,
    gatherFunc: gatherFunc,
})

export type { DataShape, Gatherer }