import { crudHelper } from "@/lib/db/crudHelper";

const memberRepo = crudHelper({
    table: 'members',
    key: "id_member",
    alias: "m"
})