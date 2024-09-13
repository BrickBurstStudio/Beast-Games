import { RunService, TweenService } from "@rbxts/services";

export function tweenScale(
  startScale: number,
  endScale: number,
  tweenInfo: TweenInfo,
  model: Model,
) {
  return new Promise((resolve) => {
    let elapsed = 0;
    let scale = 0.1;
    let tweenConnection: RBXScriptConnection;

    function onStep(deltaTime: number) {
      elapsed = math.min(elapsed + deltaTime, tweenInfo.Time);

      const alpha = TweenService.GetValue(
        elapsed / tweenInfo.Time,
        tweenInfo.EasingStyle,
        tweenInfo.EasingDirection,
      );

      scale = startScale + alpha * (endScale - startScale);

      if (scale > 0) model.ScaleTo(scale);

      if (elapsed === tweenInfo.Time) {
        tweenConnection.Disconnect();
        resolve(undefined);
      }
    }

    tweenConnection = RunService.Heartbeat.Connect(onStep);
  });
}

export function tweenNumber(
  startScale: number,
  endScale: number,
  tweenInfo: TweenInfo,
  updateFunc: (value: number) => void,
) {
  return new Promise((resolve) => {
    let elapsed = 0;
    let value = 0;
    let tweenConnection: RBXScriptConnection;

    function onStep(deltaTime: number) {
      elapsed = math.min(elapsed + deltaTime, tweenInfo.Time);

      const alpha = TweenService.GetValue(
        elapsed / tweenInfo.Time,
        tweenInfo.EasingStyle,
        tweenInfo.EasingDirection,
      );

      value = startScale + alpha * (endScale - startScale);
      updateFunc(value);

      if (elapsed === tweenInfo.Time) {
        tweenConnection.Disconnect();
        resolve(undefined);
      }
    }

    tweenConnection = RunService.Heartbeat.Connect(onStep);
  });
}
