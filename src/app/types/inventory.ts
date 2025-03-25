import { DATA_TYPES } from "../utils/data-types";
import { ROLES } from "../utils/roles";
import { User } from "./user";

export interface Inventory {
    id: string;
    name: string;
    fields: Record<string, InventoryField>;
    myRole: ROLES;
    roles: User[]
}

interface InventoryField {
    type: DATA_TYPES;
    visible: boolean;
}
