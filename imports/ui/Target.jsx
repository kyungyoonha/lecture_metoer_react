import React , { Component, useEffect, useCallback } from 'react';

// export class Target extends Component {
    
//     componentDidMount() {
//         window.addEventListener('click', this.onClick);
//     }

//     componentWillUnMount(){
//         window.removeEventListener('click', this.onClick)
//     }

//     onClick = evt => {
//         // 화면 중앙의 좌표 (crosshair 십자가의 좌표)
//         let r = this.props.size / 2;
//         const { x, y } = this.getDisplayCoordinates();
//         let wx = window.innerWidth / 2;
//         let wy = window.innerHeight / 2;
//         let cx = x + r // 왼쪽 위 이므로 반지름 더해줘야함
//         let cy = y + r
//         // 점과 점 사이의 거리 구하기 => 피타고라스 정의
//         // 타켓 원과 십자가의 중심 거리가 타겟원의 반지름 보다 큰 경우 클릭 안됌
//         // 타켓 원과 십자가의 중심 거리가 타겟원의 반지름 보다 작거나 같은 경우 클릭 됌
//         let d = Math.sqrt(Math.pow(cx - wx, 2) +  Math.pow(cy - wy, 2))
//         if (d <= r){
//             console.log('clicking', d)
//         }
//     } 

//     getDisplayCoordinates(){
//         let { size, x, y } = this.props;
//         x = x * (size / 100);
//         y = y * (size / 100);

//         return { x, y }
//     }
//     render(){
//         // 사이즈가 큰게 더 빠르게 움직임
//         const { size } = this.props;
//         const { x, y } = this.getDisplayCoordinates();
        
//         return <div className="target"  style={{ zIndex: size, width: size, height: size, transform: `translate3d(${x}px, ${y}px, 0)`}} />
//     }
// }

export const Target = React.forwardRef(({ style, size, x, y, onClick }, ref) => {
    x = x * (size / 100);
    y = y * (size / 100);

    const onClickEvent = () => {
        // 화면 중앙의 좌표 (crosshair 십자가의 좌표)
        let r = size / 2;
        let wx = window.innerWidth / 2;
        let wy = window.innerHeight / 2;
        let cx = x + r // 왼쪽 위 이므로 반지름 더해줘야함
        let cy = y + r
        // 점과 점 사이의 거리 구하기 => 피타고라스 정의
        // 타켓 원과 십자가의 중심 거리가 타겟원의 반지름 보다 큰 경우 클릭 안됌
        // 타켓 원과 십자가의 중심 거리가 타겟원의 반지름 보다 작거나 같은 경우 클릭 됌
        let d = Math.sqrt(Math.pow(cx-wx, 2) +  Math.pow(cy-wy,2))
        if (d <= r){
            onClick('good', size, d)
        }
    }
    
    useEffect(()=>{
        window.addEventListener('click', onClickEvent);
        return () => window.removeEventListener('click', onClickEvent);
    }, [x, y])


    
    return <div className="target"  style={{ zIndex: size, width: size, height: size, transform: `translate3d(${x}px, ${y}px, 0) scale(${style.scale})`}} />
})

