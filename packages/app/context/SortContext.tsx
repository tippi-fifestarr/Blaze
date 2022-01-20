import { createContext, Context, useState, FC } from "react";
import {SortContext} from "@/types"

const SortCtx: Context<SortContext> = createContext<SortContext>({sortType: {text: "Newest", value: "newest"}, changeSortType: () => {}});

export const SortProvider: FC = ({ children }) => {
    const [sortType, setSortType] = useState<SortContext["sortType"]>({text: "Newest", value: "newest"});
    const changeSortType = (sortType: SortContext["sortType"]) => {
        setSortType(sortType);
    }
    return <SortCtx.Provider value={{sortType, changeSortType}}>{children}</SortCtx.Provider>
}

export default SortCtx;