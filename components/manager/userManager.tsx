'use client'
import { getAllPrivileges, getPrivilegeSet, searchUsers } from "@/lib/api";
import { PrivilegeSet, PrivilegeStatus, User } from "@/lib/types";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect, useState } from "react"
import UserCard from "./userCard";


export default function UserManager(){
    const [steamId, setSteamId] : [string, any] = useState("");
    const [users, setUsers] : [User[], any] = useState([]);

    const [selectedUser, setSelectedUser] : [User | null, any] = useState(null);
    const [userPrivileges, setUserPrivileges] : [PrivilegeStatus[] | [], any] = useState([]);
    const [privilegeSet, setPrivilegeSet] : [PrivilegeSet | null, any] = useState(null);
    

    const findUsers = (text: string) => {
        searchUsers(text).then((r) => setUsers(r));
    }

    const onSelect = (key : any) =>{
        const user = users.find((u) => u.id == key);
        if (user){
            setSelectedUser(user);
            getAllPrivileges(user.steamId).then((up) => setUserPrivileges(up));
            getPrivilegeSet(user.steamId).then((ps) => setPrivilegeSet(ps));
        }
    }

    useEffect(() => {
        searchUsers('').then((u) => setUsers(u));
    }, []);

    return(
        <div className="min-w-[25rem]">
            <Autocomplete
                label="Поиск по Steam ID"
                items={users}
                onInputChange={findUsers}
                allowsCustomValue={true}
                onSelectionChange={onSelect}   
                listboxProps={{emptyContent: "Пользователи не найдены..."}}
            >
                {
                (user) =>(
                    <AutocompleteItem key={user.id} textValue={`${user.id}# ${user.steamId}`}>
                        {`${user.id}# ${user.steamId}`}
                    </AutocompleteItem>
                )       
                }
            </Autocomplete>
            <div>
                {
                    selectedUser ?
                    <UserCard user={selectedUser} startPrivileges={userPrivileges} startPrivilegeSet={privilegeSet}/>
                    :
                    null
                }
            </div>
        </div>
    )
}