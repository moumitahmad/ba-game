import { createClient } from '@supabase/supabase-js'


let supabase;

export class Database {

    constructor() {
        var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdXlrdW10c2l3Y291eHlvY2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc3Nzk4NTcsImV4cCI6MjAwMzM1NTg1N30.DsfnFGLkhf98Hu1W7Jkb_uiqCMc8ye_ii9dDyDoybrQ'
        var SUPABASE_URL = "https://squykumtsiwcouxyocjb.supabase.co"
        supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    }

    static async getSolutionsByChallengeID(challengeID) {
        var { data: solutions, error } = await supabase
            .from('solutions')
            .select('*')
            .eq('challengeID', challengeID)
            .order('id', { ascending: true }) // TODO: sort by most popular
        
        if(error) {
            console.log(error)
            throw new Error(error)
        }

        return solutions
    }

    static async saveNewSolutions(solutions = []) {
        const { data, error } = await supabase
            .from('solutions')
            .insert(solutions)

        if(error) {
            throw new Error(error)
        }

    }

    static async likeSolution(solution) {
        console.log(solution.likes)
        const { data, error } = await supabase
            .from('solutions')
            .update({ likes: ++solution.likes })
            .eq('id', solution.id)
            .select()

        return data[0]
    }

    static async unlikeSolution(solution) {
        console.log(solution.likes)
        const { data, error } = await supabase
            .from('solutions')
            .update({ likes: --solution.likes })
            .eq('id', solution.id)
            .select()

        return data[0]
    }

    static async getCommentsBySolutionID(solutionID) {
        var { data: comments, error } = await supabase
            .from('comments')
            .select('*')
            .eq('solutionID', solutionID)
            .order('id', { ascending: true })

        if(error) {
            console.log(error)
            throw new Error(error)
        }
        return comments
    }

    static async saveNewComment(comment) {
        const { data, error } = await supabase
            .from('comments')
            .insert(comment)
            .select()

        if(error) {
            throw new Error(error)
        }
        return data[0]
    }

}
