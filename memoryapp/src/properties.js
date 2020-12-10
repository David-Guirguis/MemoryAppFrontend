export const serverHost = "http://localhost:8080"
export const userService = "/UserService"
export const memoryService = "/MemoryService"
export const login = "/login"
export const postMemory = "/postMemory"
export const getMemories = "/getUserMemories"
export const deleteMemory = "/deleteMemory"
export const editMemory = "/editMemory"

const colors = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple"
]


export function randomTagColor (){
    let index = Math.floor(Math.random() * (colors.length - 1))
    return colors[index];
}

