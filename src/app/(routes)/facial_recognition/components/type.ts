export type StageStatus = 'loading' | 'failed' | 'successful' | 'neutral';

export interface Stage {
    id: string;
    label: string;
    status: StageStatus;
    loadingText: string;
    errorText: string;
    successText: string;
    neutralText: string;
}