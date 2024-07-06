'use client'

import { getPrivilegeTypes } from "@/lib/api";
import { PrivilegeType } from "@/lib/types";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect, useState } from "react";


export default function PrivilegePicker({startValue = null, onSelect} : {startValue: PrivilegeType | null, onSelect: any})
{
    const [items, setItems] : [PrivilegeType[], any]= useState([]);

    useEffect(() => {
        getPrivilegeTypes().then((pt) => setItems(pt));
    }, [])

    return(
        <Autocomplete items={items} defaultSelectedKey={startValue?.id?.toString()} label='Привелегия' onSelectionChange={(key) => onSelect(items.find((p) => p.id == key))}>
            {
                (privilege) => <AutocompleteItem key={privilege.id} textValue={privilege.name}>{`${privilege.id}# ${privilege.name}`}</AutocompleteItem>
            }
        </Autocomplete>
    )
}