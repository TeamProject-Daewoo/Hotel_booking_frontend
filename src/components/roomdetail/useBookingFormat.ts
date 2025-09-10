export function useBookingFormat(){
  const stripAngle = (u?:string)=> String(u||'').replace(/^<|>$/g,'')
  const normalizeBase = (b:any)=> ({
    ...b,
    firstimage: stripAngle(b.firstimage),
    firstimage2: stripAngle(b.firstimage2)
  })
  const asNum = (v:any)=> Number(String(v||'0').replace(/[^\d]/g,'')) || 0
  const isZeroPrice = (r:any)=>{
    const nums=[r.roomoffseasonminfee1,r.roomoffseasonminfee2,r.roompeakseasonminfee1,r.roompeakseasonminfee2].map(asNum)
    return nums.every(n=>n===0)
  }
  const lowestPrice = (r:any)=>{
    const arr=[r.roomoffseasonminfee1,r.roomoffseasonminfee2,r.roompeakseasonminfee1,r.roompeakseasonminfee2]
      .map(asNum).filter(n=>n>0)
    return arr.length ? Math.min(...arr) : 0
  }
  const currency = (n:number)=> '₩'+(Number(n||0)).toLocaleString()
  const firstNonEmpty = (arr:(string|undefined)[]) =>
    stripAngle(arr.find(Boolean) as string) || 'https://picsum.photos/400/300?blur=3'

  return { stripAngle, normalizeBase, isZeroPrice, lowestPrice, currency, firstNonEmpty }
}
