'use client'
import { getAllPrivileges, getPrivilegeSet, searchUsers } from "@/lib/api";
import { PrivilegeSet, PrivilegeStatus, User } from "@/lib/types";
import { Autocomplete, AutocompleteItem, Button, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react"
import UserCard from "./userCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";


export default function UserManager(){
    const [steamId, setSteamId] : [string, any] = useState("");
    const [users, setUsers] : [User[], any] = useState([]);

    const [selectedUser, setSelectedUser] : [User | null, any] = useState(null);
    const [userPrivileges, setUserPrivileges] : [PrivilegeStatus[] | [], any] = useState([]);
    const [privilegeSet, setPrivilegeSet] : [PrivilegeSet | null, any] = useState(null);
    const [isLoading, setLoading] : [boolean, any] = useState(false);
    const [isUpdating, setUpdating] : [boolean, any] = useState(false);
    

    const findUsers = (text: string) => {
        setLoading(true);
        searchUsers(text).then((r) => {
            setUsers(r);
            setLoading(false);
        });
    }

    const updateUsers = () => {
        setUpdating(true);
        searchUsers(steamId).then((r) => {
            setUsers(r);
            setUpdating(false);
        });
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
            <div className="flex flex-row gap-4">
                <Autocomplete
                    size="sm"
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
                <Button isIconOnly size="lg" isLoading={isUpdating} onClick={() => updateUsers()}><FontAwesomeIcon icon={faRefresh}/></Button>
            </div>
            <div className="mt-4">
                <div className="relative">
                    <div className={"transition-opacity duration-200 " + (isUpdating ? "opacity-0" : "opacity-100")}>
                    {
                        isLoading ?
                        <Spinner className="flex justify-center"/>
                        :
                        (
                            selectedUser ?
                            <UserCard user={selectedUser} startPrivileges={userPrivileges} startPrivilegeSet={privilegeSet}/>
                            :
                            null
                        )
                    }
                    </div>
                    <div className={"pointer-events-none absolute w-full h-full top-0 flex justify-center transition-opacity duration-200 "+ (isUpdating ? "opacity-100" : "opacity-0")}>
                        <Spinner size="lg"/>
                    </div>
                </div>
            </div>
        </div>
    )
}