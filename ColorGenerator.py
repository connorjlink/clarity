import re
import colorsys
import random
import matplotlib.pyplot as plt

def rgb_to_hsl(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r/255.0, g/255.0, b/255.0)
    return round(h * 360), round(s * 100), round(l * 100)

def hsl_to_rgb(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h/360.0, l/100.0, s/100.0)
    return round(r*255), round(g*255), round(b*255)

def parse_rgb(input_str):
    matches = re.findall(r'rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)', input_str)
    return [(int(r), int(g), int(b)) for r, g, b in matches]

def generate_palette(rgb_list, center_color=None):
    hsl_list = [rgb_to_hsl(*rgb) for rgb in rgb_list]
    hues = [hsl[0] for hsl in hsl_list]
    distances = [(h - hues[0]) % 360 for h in hues]

    if center_color:
        center_hue = rgb_to_hsl(*center_color)[0]
    else:
        center_hue = random.randint(0, 359)

    new_hues = [(center_hue + d) % 360 for d in distances]
    new_palette = [hsl_to_rgb(h, hsl_list[i][1], hsl_list[i][2]) for i, h in enumerate(new_hues)]

    return new_palette

# PASTE INPUT COLORS HERE
#input_colors = "rgb(240, 10, 50), rgb(100, 200, 150), rgb(0, 120, 255), rgb(255, 220, 0)"
input_colors = '''                   --ast-color-shadow: rgb(36, 66, 40);
    --ast-color-foreground-top: rgb(193, 236, 200);
    --ast-color-foreground-bottom: rgb(129, 196, 142);
    --ast-color-background-top: rgb(90, 160, 102);
    --ast-color-background-bottom: rgb(25, 81, 37);
'''
rgb_list = parse_rgb(input_colors)

# PASTE A CENTER COLOR HERE (OR NONE TO CHOOSE RANDOMLY)
center_color = (255, 255, 0)

new_palette = generate_palette(rgb_list, center_color)

prefix = "ast"

print("New Palette (RGB):")
if len(new_palette) == 5:
    print(f"--{prefix}-color-shadow: rgb{new_palette[0]};")
    print(f"--{prefix}-color-foreground-top: rgb{new_palette[1]};")
    print(f"--{prefix}-color-foreground-bottom: rgb{new_palette[2]};")
    print(f"--{prefix}-color-background-top: rgb{new_palette[3]};")
    print(f"--{prefix}-color-background-bottom: rgb{new_palette[4]};")
else:
    for rgb in new_palette:
        print(f"rgb{rgb}")

def visualize_palette(rgb_colors, title="Color Palette"):
    fig, ax = plt.subplots(figsize=(len(rgb_colors), 2))
    for i, color in enumerate(rgb_colors):
        ax.add_patch(plt.Rectangle((i, 0), 1, 1, color=[c/255 for c in color]))
        ax.text(i + 0.5, -0.2, f"rgb{color}", ha='center', va='top', fontsize=8)
    ax.set_xlim(0, len(rgb_colors))
    ax.set_ylim(0, 1)
    ax.axis('off')
    plt.title(title)
    plt.tight_layout()
    plt.show()

# Example usage:
visualize_palette(new_palette, title="Generated Palette")