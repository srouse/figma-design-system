

let _id_counter = 0
export default function uid() {
  return '_' + (_id_counter++).toString(36) + '_' + 
    Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
}