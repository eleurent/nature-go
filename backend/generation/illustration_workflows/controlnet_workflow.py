import os
import random
import sys
from typing import Sequence, Mapping, Any, Union
import torch


def get_value_at_index(obj: Union[Sequence, Mapping], index: int) -> Any:
    """Returns the value at the given index of a sequence or mapping.

    If the object is a sequence (like list or string), returns the value at the given index.
    If the object is a mapping (like a dictionary), returns the value at the index-th key.

    Some return a dictionary, in these cases, we look for the "results" key

    Args:
        obj (Union[Sequence, Mapping]): The object to retrieve the value from.
        index (int): The index of the value to retrieve.

    Returns:
        Any: The value at the given index.

    Raises:
        IndexError: If the index is out of bounds for the object and the object is not a mapping.
    """
    try:
        return obj[index]
    except KeyError:
        return obj["result"][index]


def find_path(name: str, path: str = None) -> str:
    """
    Recursively looks at parent folders starting from the given path until it finds the given name.
    Returns the path as a Path object if found, or None otherwise.
    """
    # If no path is given, use the current working directory
    if path is None:
        path = os.getcwd()

    # Check if the current directory contains the name
    if name in os.listdir(path):
        path_name = os.path.join(path, name)
        print(f"{name} found: {path_name}")
        return path_name

    # Get the parent directory
    parent_directory = os.path.dirname(path)

    # If the parent directory is the same as the current directory, we've reached the root and stop the search
    if parent_directory == path:
        return None

    # Recursively call the function with the parent directory
    return find_path(name, parent_directory)


def add_comfyui_directory_to_sys_path() -> None:
    """
    Add 'ComfyUI' to the sys.path
    """
    comfyui_path = find_path("ComfyUI")
    if comfyui_path is not None and os.path.isdir(comfyui_path):
        sys.path.append(comfyui_path)
        print(f"'{comfyui_path}' added to sys.path")


def add_extra_model_paths() -> None:
    """
    Parse the optional extra_model_paths.yaml file and add the parsed paths to the sys.path.
    """
    from main import load_extra_path_config

    extra_model_paths = find_path("extra_model_paths.yaml")

    if extra_model_paths is not None:
        load_extra_path_config(extra_model_paths)
    else:
        print("Could not find the extra_model_paths config file.")


add_comfyui_directory_to_sys_path()
add_extra_model_paths()


def import_custom_nodes() -> None:
    """Find all custom nodes in the custom_nodes folder and add those node objects to NODE_CLASS_MAPPINGS

    This function sets up a new asyncio event loop, initializes the PromptServer,
    creates a PromptQueue, and initializes the custom nodes.
    """
    import asyncio
    import execution
    from nodes import init_custom_nodes
    import server

    # Creating a new event loop and setting it as the default loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    # Creating an instance of PromptServer with the loop
    server_instance = server.PromptServer(loop)
    execution.PromptQueue(server_instance)

    # Initializing custom nodes
    init_custom_nodes()


from nodes import (
    LoadImage,
    KSampler,
    ControlNetLoader,
    CheckpointLoaderSimple,
    VAEEncode,
    CLIPTextEncode,
    NODE_CLASS_MAPPINGS,
    ControlNetApplyAdvanced,
    SaveImage,
    VAEDecode,
)


def main(positive_prompt: str, negative_prompt: str, control_image: str):
    import_custom_nodes()
    with torch.inference_mode():
        checkpointloadersimple = CheckpointLoaderSimple()
        checkpointloadersimple_2 = checkpointloadersimple.load_checkpoint(
            ckpt_name="sd_xl_base_1.0.safetensors"
        )

        cliptextencode = CLIPTextEncode()
        cliptextencode_4 = cliptextencode.encode(
            text=positive_prompt,
            clip=get_value_at_index(checkpointloadersimple_2, 1),
        )

        cliptextencode_5 = cliptextencode.encode(
            text=negative_prompt, clip=get_value_at_index(checkpointloadersimple_2, 1)
        )

        loadimage = LoadImage()
        loadimage_7 = loadimage.load_image(image=control_image)

        controlnetloader = ControlNetLoader()
        controlnetloader_9 = controlnetloader.load_controlnet(
            control_net_name="control-lora-canny-rank256.safetensors"
        )

        imagescaletototalpixels = NODE_CLASS_MAPPINGS["ImageScaleToTotalPixels"]()
        imagescaletototalpixels_21 = imagescaletototalpixels.upscale(
            upscale_method="nearest-exact",
            megapixels=1,
            image=get_value_at_index(loadimage_7, 0),
        )

        vaeencode = VAEEncode()
        vaeencode_11 = vaeencode.encode(
            pixels=get_value_at_index(imagescaletototalpixels_21, 0),
            vae=get_value_at_index(checkpointloadersimple_2, 2),
        )

        cannyedgepreprocessor = NODE_CLASS_MAPPINGS["CannyEdgePreprocessor"]()
        controlnetapplyadvanced = ControlNetApplyAdvanced()
        ksampler = KSampler()
        vaedecode = VAEDecode()
        saveimage = SaveImage()
        # image_remove_background_rembg = NODE_CLASS_MAPPINGS[
        #     "Image Remove Background (rembg)"
        # ]()

        for q in range(1):
            cannyedgepreprocessor_23 = cannyedgepreprocessor.execute(
                low_threshold=100,
                high_threshold=200,
                image=get_value_at_index(imagescaletototalpixels_21, 0),
            )

            controlnetapplyadvanced_10 = controlnetapplyadvanced.apply_controlnet(
                strength=0.9,
                start_percent=0,
                end_percent=0.8,
                positive=get_value_at_index(cliptextencode_4, 0),
                negative=get_value_at_index(cliptextencode_5, 0),
                control_net=get_value_at_index(controlnetloader_9, 0),
                image=get_value_at_index(cannyedgepreprocessor_23, 0),
            )

            ksampler_1 = ksampler.sample(
                seed=random.randint(1, 2**64),
                steps=20,
                cfg=8,
                sampler_name="euler_ancestral",
                scheduler="normal",
                denoise=1,
                model=get_value_at_index(checkpointloadersimple_2, 0),
                positive=get_value_at_index(controlnetapplyadvanced_10, 0),
                negative=get_value_at_index(controlnetapplyadvanced_10, 1),
                latent_image=get_value_at_index(vaeencode_11, 0),
            )

            vaedecode_6 = vaedecode.decode(
                samples=get_value_at_index(ksampler_1, 0),
                vae=get_value_at_index(checkpointloadersimple_2, 2),
            )

            saveimage_8 = saveimage.save_images(
                filename_prefix="controlnet_illustration",
                images=get_value_at_index(vaedecode_6, 0),
            )

            # image_remove_background_rembg_24 = (
            #     image_remove_background_rembg.remove_background(
            #         image=get_value_at_index(vaedecode_6, 0)
            #     )
            # )

            # saveimage_25 = saveimage.save_images(
            #     filename_prefix="controlnet_illustration_rembg",
            #     images=get_value_at_index(image_remove_background_rembg_24, 0),
            # )

            saveimage_26 = saveimage.save_images(
                filename_prefix="controlnet_mask",
                images=get_value_at_index(cannyedgepreprocessor_23, 0),
            )
            return {
                "controlnet_mask": saveimage_26,
                # "illustration_transparent": saveimage_25,
                "illustration": saveimage_8,
            }


if __name__ == "__main__":
    main(
        positive_prompt="herbarium illustration of Linaria alpina, 19th century",
        negative_prompt="black and white",
        control_image="Linaria.alpina.web.jpg",
    )
