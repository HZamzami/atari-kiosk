export type FrameMetadata = {
    fps: number;
    inference_time: number;
    postprocessing_time: number;
    face_detected: boolean;
    depth: number | null;
    tilt: number | null;
    temperature: number | null;
    measurement_complete: boolean,
    request_id: number | null
  }
