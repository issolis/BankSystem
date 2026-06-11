export class Username{
    constructor(
       private readonly username: string
    ){
        if (!username  || !username.trim()){
            throw new Error ("Username cannot be empty"); 
        }
        if(username.length < 5){
            throw new Error ("Username must have at least 3 characters");
        }
        if(username.length > 30)
            throw new Error ("Username cannot have more than 39 characters"); 
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            throw new Error("Username can only contain letters, numbers and underscores");
        }
    }

    getUsername():string{
        return this.username; 
    }
    equals(other: Username):boolean{
        return this.username === other.username; 
    }
}