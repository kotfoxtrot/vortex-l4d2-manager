'use client'

import { getChatlogs } from "@/lib/api";
import { ChatLog } from "@/lib/types";
import { DatePicker, Table, TableCell, TableColumn, TableRow, TableBody, TableHeader, Spinner, Input, Button } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { KeyboardEvent, useEffect, useState } from "react";
import { useAsyncList } from "react-stately";
import { parseAbsolute, now, ZonedDateTime} from "@internationalized/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChain, faCheck, faCross, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function LogsPage(){
    const loadCount = 30;
    const [logs, setLogs] : [ChatLog[], any] = useState([]);
    const [loading, setLoading]: [boolean, any] = useState(false);
    const [more, setMore]: [boolean, any] = useState(true);

    const [steamId, setSteamId]: [string, any] = useState('');
    const [nick, setNick]: [string, any] = useState('')
    const [server, setServer]: [string, any] = useState('');
    const [text, setText]: [string, any] = useState('');
    const [startTime, setStartTime]: [ZonedDateTime | null, any] = useState(now('Europe/Moscow').subtract({days:7}));
    const [endTime, setEndTime]: [ZonedDateTime | null, any] = useState(now('Europe/Moscow'));

    const correctTime = (someTime: ZonedDateTime | null, isStart: boolean = true) : ZonedDateTime => {
        return someTime || now('Europe/Moscow').subtract({years:(isStart ? 10 : 0)});
    };

    let [steamIdTemp, nickTemp, serverTemp, textTemp, startTimeTemp, endTimeTemp] = [
        steamId, nick, server, text, 
        correctTime(startTime).add({hours:3}).toAbsoluteString(), 
        correctTime(endTime, false).add({hours:3}).toAbsoluteString()];
    

    const updateList = () => {
        setTempFields();
        setLoading(true);
        list.reload();
        setLoading(false);
    }

    const setTempFields = () => {
        steamIdTemp = steamId;
        nickTemp = nick;
        serverTemp = server;
        textTemp = text;
        startTimeTemp = correctTime(startTime).add({hours:3}).toAbsoluteString();
        endTimeTemp = correctTime(endTime, false).add({hours:3}).toAbsoluteString();
    };

    const clearFields = () => {
        setSteamId('');
        setServer('');
        setText('');
        setNick('');
        setStartTime(now('Europe/Moscow').subtract({days:7}));
        setEndTime(now('Europe/Moscow'));
        setTempFields();
    };


    let list = useAsyncList(
        {
            async load({signal, cursor}) {
                if(cursor) setLoading(false);
                const res: any = 
                    await getChatlogs(cursor||0, loadCount, textTemp, steamIdTemp, serverTemp, startTimeTemp, endTimeTemp, nickTemp);
                console.log(textTemp);
                setMore(res != null && res.length == loadCount);
                return{
                    items: res || [],
                    cursor: `${Number(cursor || 0) + loadCount}`
                }
            }
        }
    );
    const [loaderRef, scrollRef] = useInfiniteScroll(
        {
            hasMore: more,
            onLoadMore: list.loadMore
        }
    );

    const teamToStr = (team: number) => {
        switch(team){
            case 1:
                return "Наблюдатель";
            case 2:
                return "Выживший";
            case 3:
                return "Зараженный";
            default:
                return "хз"
        }
    }

    const handleInputKeys = (event : any) => {
        if(event.key === 'Enter')
        {
            updateList();
        }
    }

    //max-h-[92vh]
    return(
        <main className="flex flex-col px-8 md:px-16 lg:px-32 py-4 md:py-8 lg:py-16 overflow-hidden gap-4">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <Input label="Steam ID" size="sm" onValueChange={setSteamId} value={steamId} onKeyUp={handleInputKeys}/>
                    <Input label="Никнейм" size="sm" onValueChange={setNick} value={nick} onKeyUp={handleInputKeys}/>
                    <Input label="Название сервера" size="sm" onValueChange={setServer} value={server} onKeyUp={handleInputKeys}/>
                    <Input label="Текст" size="sm" onValueChange={setText} value={text} onKeyUp={handleInputKeys}/>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <DatePicker
                        size="sm"
                        value={startTime}
                        onChange={(t) => setStartTime(t)}
                        hideTimeZone
                        hourCycle={24}
                        label="От"/>
                    <DatePicker
                        size="sm"
                        value={endTime}
                        onChange={(t) => setEndTime(t)}
                        hideTimeZone
                        hourCycle={24}
                        label="До"/>
                    <Button size="lg" onClick={() => clearFields()}>
                        Очистить
                    </Button>
                    <Button size="lg" color="success" isLoading={loading} onClick={() => updateList()}>
                        Найти
                    </Button>
                </div>
            </div>
            <div className="overflow-hidden">
                <Table
                    isHeaderSticky
                    className="h-[70vh]"
                    aria-label="Логи чата"
                    baseRef={scrollRef}
            
                    bottomContent={
                        (!more) ? null :
                        <div className="flex w-full justify-center"><Spinner ref={loaderRef} size="sm"/></div>
                    }
                >
                    <TableHeader>
                        <TableColumn>Steam ID</TableColumn>
                        <TableColumn>Сервер</TableColumn>
                        <TableColumn>Команда</TableColumn>
                        <TableColumn>Никнейм</TableColumn>
                        <TableColumn>Текст</TableColumn>
                        <TableColumn>Время</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={list.items as ChatLog[] || []}
                        isLoading={loading}
                        emptyContent="Ничего не найдено :("
                        loadingContent={<Spinner size="lg" label="Загрузка..."/>}
                    >
                        {
                        l => <TableRow key={`${l.id}${l.time}`}>
                            <TableCell className="text-sm lg:text-lg">{l.steamId}</TableCell>
                            <TableCell>{l.server}</TableCell>
                            <TableCell>{teamToStr(l.team)} ({l.chatTeam ? "Команде" : "Всем"})</TableCell>
                            <TableCell>{l.nickname || "Неизвестен"}</TableCell>
                            <TableCell className="text-wrap">{l.text}</TableCell>
                            <TableCell className="text-center">{l.time.replace('T', ' ')}</TableCell>
                        </TableRow>
                        }
                    </TableBody>
                </Table>
            </div>
        </main>
    );
}
/*
<TableCell className="text-sm lg:text-lg">{l.steamId}</TableCell>
<TableCell>{l.server}</TableCell>
<TableCell className="text-center">{l.time.replace('T', ' ')}</TableCell>
<TableCell>{teamToStr(l.team)}</TableCell>
<TableCell><FontAwesomeIcon icon={l.chatTeam ? faCheck : faXmark} size="xl"/></TableCell>
<TableCell className="text-wrap">{l.text}</TableCell>
*/