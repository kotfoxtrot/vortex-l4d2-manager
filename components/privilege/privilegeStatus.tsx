'use client'
import { PrivilegeStatus } from "@/lib/types";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup, Card, CardBody, CardFooter, DatePicker, Divider, Modal, ModalBody, ModalContent, ModalHeader, Popover, PopoverContent, PopoverTrigger, TimeInput, useDisclosure } from "@nextui-org/react";
import PrivilegePicker from "./privilegePicker";
import { parseDate, parseAbsolute } from "@internationalized/date";
import { useState } from "react";
import { deletePrivilege, editPrivilege } from "@/lib/api";
import { getCookie } from "cookies-next";

export default function PrivilegeStatusCard(
    {startPrivilegeStatus, onDelete = null} : {startPrivilegeStatus : PrivilegeStatus, onDelete? : any}
)
{
    const [privilegeStatus, setPrivilegeStatus] : [PrivilegeStatus, any] = useState(startPrivilegeStatus);
    const privilege = privilegeStatus.privilege;
    let tempPrivilegeStatus = privilegeStatus;
    const date = new Date(Date.parse(privilegeStatus.activeUntil));
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
    const [delOpen, delOpenChanged] : [boolean, any] = useState(false);
    const [hidden, setHidden] : [boolean, any] = useState(false);

    let tempPrivilege = privilege;
    let tempDate = date;

    const abortChanges = () => {
        setPrivilegeStatus(startPrivilegeStatus);
        onClose();
    };
    const applyChanges = () => {
        tempPrivilegeStatus.privilege = tempPrivilege;
        tempDate.setHours(tempDate.getHours() + 3);
        tempPrivilegeStatus.activeUntil = tempDate.toISOString().slice(0, 19).replace('T', ' ');
        setPrivilegeStatus(tempPrivilegeStatus);
        onClose();
        const token = getCookie('vortex-api-token');
        if (token) editPrivilege(privilegeStatus, token).then((p) => setPrivilegeStatus(p));
        else console.error('Token is not found in cookies!');
    };

    const deleteClicked = () => {
        delOpenChanged(false);
        const token = getCookie('vortex-api-token');
        if (token){
            deletePrivilege(privilegeStatus.id, token);
            onDelete();
            setHidden(true);
        }
        else console.error('Token is not found in cookies!');
    }

    return(
            <div className={"flex flex-row items-center justify-between gap-4 bg-background-100 rounded-xl shadow-md pl-2 overflow-hidden " + (hidden ? "hidden":"")}>
                <div className="flex flex-row items-center gap-4 w-full justify-between">
                    <div className="flex flex-col">
                        <div className="text-sm">{privilege.id}# {privilege.name}</div>
                        <div className="text-xs text-text-800">{privilege.description}</div>
                    </div>
                    <div>
                        {date.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div className="flex flex-row justify-end">
                        <Button  isIconOnly className="h-12 w-12 rounded-none" onClick={onOpen}><FontAwesomeIcon icon={faPenToSquare} width={24}/></Button>
                        <Divider orientation="vertical"/>
                        <Popover isOpen={delOpen} onOpenChange={delOpenChanged}>
                            <PopoverTrigger>
                                <Button isIconOnly className="h-12 w-12 rounded-none"><FontAwesomeIcon icon={faTrashCan} width={20}/></Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <span className="text-lg mb-4">Удалить привелегию?</span>
                                <div className="flex flex-row gap-2">
                                    <Button color="danger" onClick={deleteClicked}>Удалить</Button>
                                    <Button color="success" onClick={() => delOpenChanged(false)}>Отмена</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                    <ModalHeader>Редактор привелегии</ModalHeader>
                    <ModalBody>
                    <PrivilegePicker startValue={privilege} onSelect={(p : any) => tempPrivilege = p}/>
                    <DatePicker 
                        label="Активна до"
                        hideTimeZone
                        hourCycle={24}
                        onChange={(zonedDate) => tempDate = zonedDate?.toDate() || new Date()}
                        defaultValue={parseAbsolute(date.toISOString(), 'Europe/Moscow')}
                    />    
                    <div className="flex flex-row justify-left gap-4">
                        <Button onClick={applyChanges}>Подтвердить</Button>
                        <Button onClick={abortChanges}>Отмена</Button>
                    </div>
                    </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
    )
}