export interface IPVFXPrivilege {
  objectName: string | undefined;
  objectValue: string | undefined;
  accessWebLinkUrl: string | undefined;
  canAccess: boolean;
}

export interface PVFXCoordinates {
  pvfxObjectName: string;
  pvfxValueName: string;
  pvfFunction: string;
  pvfLevel: number;
}
