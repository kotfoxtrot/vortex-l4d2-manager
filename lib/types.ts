
export type PerkSet = {
    survivorPerk1: string,
    survivorPerk2: string,
    survivorPerk3: string,
    survivorPerk4: string,
    boomerPerk: string,
    smokerPerk: string,
    hunterPerk: string,
    jockeyPerk: string,
    spitterPerk: string,
    chargerPerk: string,
    tankPerk: string
}

export type PrivilegeSet = {
    owner: boolean;
    admin: boolean;
    moderator: boolean;
    soundpad: boolean;
    mediaPlayer: boolean;
    vip: boolean;
    premium: boolean;
    legend: boolean;
    customPrefix: string;
    welcomePhrase: string;
}

export type PrivilegeType = {
    id: number,
    accessLevel: number,
    name: string,
    description: string,
}

export type PrivilegeStatus = {
    id: number,
    privilege : PrivilegeType,
    activeUntil: string,
    userId: number
}

export type User = {
    id: number,
    steamId: string
}