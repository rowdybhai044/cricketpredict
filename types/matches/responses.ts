export interface MatchData {
    id: string;
    title: string;
    league_name: string;
    game_type: string;
    team_a: string;
    team_a_code: string;
    team_b: string;
    team_b_code: string;
    mobile: number;
    option_a: string;
    option_b: string;
    odds_a: string;
    odds_b: string;
    start_time: string;
    bet_close_time: string;
    status: string;
    winner: string | null;
}

export interface GetAllMatchesResponse {
    success: boolean;
    matches: MatchData[];
}