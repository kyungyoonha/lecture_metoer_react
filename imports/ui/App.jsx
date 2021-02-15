import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor'
import _ from 'lodash'
import { Transition, animated } from 'react-spring/renderprops';
import { withTracker } from 'meteor/react-meteor-data';

import { Target } from './Target';
import { GameCollection } from '../api/game.collection';
import { PlayerNameForm } from './PlayerNameForm';
import { PlayerList } from './PlayerList';
const AnimatedTarget = animated(Target);

const App = ({ game }) => {
  const [state, setState] = useState({ 
    playerId: null,
    x: 0, 
    y: 0, 
  })
  const { x, y, playerId } = state;
  
  useEffect(() => {
    // 1초마다핑을 보낸다.
    // 현재 게임을 유저가 사용중인지 체크
    setInterval(() => {
      const gameId = game._id;
      if(gameId){
        Meteor.call('game.ping', gameId)
      }
    }, 5000);

    let isPointerLocked = false;
    let handleEventClick = () => {
      if (!isPointerLocked && state.playerId){
        document.body.requestPointerLock()
      }
    }

    let handleEventPointer = () => {
      isPointerLocked = document.pointerLockElement === document.body
    }

    // 60 프레임을 유지해야 잘보임 => 60보다 적은 프레임인 경우 끊어지는 것 처럼 보인다.
    // 1초에 60번 보다 더 많이 호출되는 경우 프레임이 적게 나옴
    // 보통의 경우, 60프레임을 나타낼 정도로 호출되는 것보다 더 많이 호출되는 경우 끊어지는 것처럼 보인다.
    let temp_x = 0, temp_y = 0;
    // const view = { temp_x, temp_y };
    let handleEventMouseMove = (evt) => {
      if(isPointerLocked){
        temp_x += evt.movementX;
        temp_y += evt.movementY;

        // view.x = temp_x;
        // view.y = temp_y;
      }
    }
    // window.requestAnimtaionFrame 은 애니메이션을 위한 비동기 함수
    // 비동기 함수이고 스스로를 호출하지 않기 때문에 재귀적으로 window.requestAnimationFrame을 다시 실행해줘야한다.
    // 기본적으로 1 초에 60번, 보통은 모니터 주사율에 맞추어 함수를 실행하게 해준다.
    // 모니터의 평균 주사율이 60FPS 이라면 1초에 60번 실행한다.
    let animation = () => {
      if(x !== temp_x || y !== temp_y ) setState(prev => ({ ...prev, x: temp_x, y: temp_y }))
      window.requestAnimationFrame(animation);
        // 프레임에 맞춰서 setState를 해주므로 프레임이 낮아져서 끊기는 현상이 없어진다.
        // view로 한번 더 변수를 지정하는 이유:
        // animation 함수의 경우 requestAnimationFrame에 의해 호출되는데 x, y의 변화를 감지하지 못한다.
        // 새로운 object로 정의해줘서 사용하면 메모리에서 참조가 가능해진다.
        
        // 자동으로 호출하지 않으므로 재귀적으로 호출해줘야한다.
      
      
    }
    window.requestAnimationFrame(animation)
    window.addEventListener('click', handleEventClick)
    window.addEventListener('mousemove', handleEventMouseMove)
    document.addEventListener('pointerlockchange', handleEventPointer)
    
    return () => {
      window.removeEventListener('click', handleEventClick)
      window.removeEventListener('mousemove', handleEventMouseMove)
      document.removeEventListener('pointerlockchange', handleEventPointer)
    }
  } , [playerId])
  return(
    <>  
      <div className="crosshair" />
      <PlayerList players={game.players} />
      {playerId ? (
        <Transition 
          native // 자식 컴포넌트에 Animated 사용시 넣어줘야한다. Will skip rendering the component if true and write to the dom directly
          items={game.targets}
          keys={(target) => target._id}
          from={{ scale: 1 }}
          enter={{ scale: 1 }}
          leave={{ scale: 0 }}
        >
          {(target) => {
            // transition에서 내려주는 값 => scale을 설정 했으면 scale을 내려줌
            // scale leave될때 0으로 바뀌는데 매초마다 prop값을 1부터 0까지 줄여주면서 밑에 Target컴포넌트를 리렌더링 하므로 렉이 걸리기 시작한다.
            return (props) => { 
              return <AnimatedTarget 
                style={{ ...props, color: target.color }} 
                key={target._id} 
                onClick={() => 
                  Meteor.call("game.targetHit", game._id, target._id, playerId )
                } 
                x={target.x-x} 
                y={target.y-y} 
                size={target.size}
              /> 
            }
          }}
        </Transition>
        
      ) 
      : <PlayerNameForm onSubmit={name => Meteor.call('game.addPlayer', game._id, name, (err, playerId) => {
        setState({
          ...state,
          playerId
        })
      })}/>}
      
    </>
  )
}

export const AppWithTracekr = withTracker(({ gameId })=> {
  const game = GameCollection.findOne({ _id: gameId }) || { targets: []}; 
  return { game }
})(App)
// export class App extends Component {
//   state = { 
//     x: 0, 
//     y: 0,
//     targets: [
//       { _id: 1, x: 300, y: 300, size: 100 },
//       { _id: 2, x: 500, y: 300, size: 150 },
//       { _id: 3, x: 500, y: 500, size: 200 },
//       { _id: 4, x: 300, y: 500, size: 300 },
//     ]
//   }


//   componentDidMount(){
//     let isPointerLocked = false;

//     window.addEventListener('click', () => {
//       if (!isPointerLocked){
//         document.body.requestPointerLock()
//       }
//     })

//     document.addEventListener('pointerlockchange', () => {
//       isPointerLocked = document.pointerLockElement === document.body
//     })
    
//     let x = 0, y = 0;
//     window.addEventListener('mousemove', (evt) => {
//       if(isPointerLocked){
//         x += evt.movementX;
//         y += evt.movementY;
//         this.setState({ x, y })
//       }
//     })
//   }



//   render(){
//     const { x, y } = this.state;
//     return (
//       <>  
//         <div className="crosshair" />
//         {_.map(this.state.targets, (target) => {
//           return <Target 
//             key={target._id} 
//             onClick={() => {
//               const i = _.findIndex(this.state.targets, { _id: target._id})
//               const targets = this.state.targets.slice(0);
//               targets.splice(i, 1)
//               this.setState({ targets })
//             }} 
//             x={target.x-x} 
//             y={target.y-y} 
//             size={target.size}/> 
//         })}
        
//       </>
//     )
//   }
// }