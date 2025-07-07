export type Point = { 
    x: number; 
    y: number;
};

export type Line = { 
    start: Point; 
    end: Point;
};

export type ClickspotLocation = 'left' | 'right' | 'bottom';

export type Clickspot = { 
    id: string; 
    location: ClickspotLocation;
    isConnected?: boolean;
};

export type ClickspotInfo = { 
    nodeId: string; 
    clickspotId: string; 
    location: ClickspotLocation | null
};

export type Connection = {
    from: ClickspotInfo;
    to: ClickspotInfo;
};

export type NodeData = {
    id: string;
    label: string;
    position: Point;
    parentId?: string;
    clickspots: Clickspot[];
};
