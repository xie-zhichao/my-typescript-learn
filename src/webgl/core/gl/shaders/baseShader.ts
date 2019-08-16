import { Shader } from "./shader";
import { HttpClient } from "../../../common/http/httpclient";

export class BasicShader extends Shader {
  public constructor(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
    super('basic', gl, vertexSource, fragmentSource);
  }

  public static async loadBasicShaderAsync(gl: WebGLRenderingContext, vertexSourceUrl: string, fragmentSourceUrl: string): Promise<BasicShader> {
    const { response: vertexSource } = await HttpClient.get(vertexSourceUrl);
    const { response: fragmentSource } = await HttpClient.get(fragmentSourceUrl);

    return new BasicShader(gl, vertexSource, fragmentSource);
  }
}
