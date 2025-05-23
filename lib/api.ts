'use server'

import { ChatLog, PrivilegeSet, PrivilegeStatus, PrivilegeType, User } from "./types";

const host = process.env.apiHost;

const myGet = async <Type>(href: string, settings: any = {}) => {
    try{
        const response = await fetch(`${host}/${href}`, settings);
        if(!response.ok) throw new Error("Api недоступен!");
        const data: Type = await response.json();
        return data;
    } catch(e) {
        console.error(`Ошибка в "${href}": ${e}`);
        return null;
    }
};
const myDelete = async(href: string, token: string, settings: any = {method: "DELETE", headers: {Authorization: `Bearer ${token}`}}) => {
    try{
        const response = await fetch(`${host}/${href}`, settings);
        if(!response.ok) return false;
        return true;
    } catch(e) {
        console.error(`Ошибка в "${href}": ${e}`);
        return false;
    }
};
const myPost = async <Type>(href: string, token: string, settings: any = {method: "POST", headers: {Authorization: `Bearer ${token}`}}) => await myGet<Type>(href, settings);
const myPut = async <Type>(href: string, token: string, settings: any = {method: "PUT", headers: {Authorization: `Bearer ${token}`}}) => await myGet<Type>(href, settings);



export const checkToken = async (token : string) => await fetch(`${host}/auth/check_token`, {headers: {Authorization: `Bearer ${token}`}})
    .then((r) => r.status == 200);

export const getPrivilegeSet = async (steamId: string) => await myGet<PrivilegeSet>(`privilege?steam_id=${steamId}`);

export const deletePrivilege = async (privilegeId: any, token: string) => await myDelete(`privilege?id=${privilegeId}`, token);

export const setPrivilege = async (steamId: any, privilegeId: any, until: string, token: string) => 
    await myPost<PrivilegeStatus>(`privilege?steam_id=${steamId}&privilege_id=${privilegeId}&until=${until}`, token);

export const editPrivilege = async (ps : PrivilegeStatus, token: string) => 
    await myPut<PrivilegeStatus>(`privilege?id=${ps.id}&privilege_id=${ps.privilege.id}&until=${ps.activeUntil}`, token);

export const getAllPrivileges = async (steamId: any) => await myGet<PrivilegeStatus[]>(`privilege/all?steam_id=${steamId}`);

export const getPrivilegeTypes = async () => await myGet<PrivilegeType[]>('privilege/types');

export const searchUsers = async (query:string) => await myGet<User[]>(`user/search?query=${query}`) || [];

export const setWelcomePhrase = async (steamId : string, welcomePhrase : string, token : string) => 
    await myPost<string>(`privilege/welcome_phrase?steam_id=${steamId}&phrase=${welcomePhrase}`, token);

export const setCustomPrefix = async (steamId : string, customPrefix : string, token : string) => 
    await myPost<string>(`privilege/custom_prefix?steam_id=${steamId}&prefix=${customPrefix}`, token);

export const getChatlogs = async (offset: number | string = 0, limit: number | string = 25, text: string = "", steam_id: string = "", 
    server: string = "", start_time: string = "2000-01-01T00:00:00", end_time: string = "2100-01-01T00:00:00", nick: string = '') =>
        await myGet<ChatLog[]>(`logs?text=${text}&steam_id=${steam_id}&server=${server}&offset=${offset}&limit=${limit}&start_time=${start_time}&end_time=${end_time}` + (nick.length != 0 ? `&nickname=${nick}` : ''));