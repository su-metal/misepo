from PIL import Image, ImageOps
import os

def compose_image():
    base_path = r"f:\App_dev\misepo\public\misepo_hero_hand_phone_1769997838406.png"
    overlay_path = r"f:\App_dev\misepo\public\hero_screen_new.jpg"
    output_path = r"f:\App_dev\misepo\public\misepo_hero_composite_final.png"

    try:
        base_img = Image.open(base_path).convert("RGBA")
        overlay_img = Image.open(overlay_path).convert("RGBA")

        # Base image dimensions
        W, H = base_img.size
        
        # Tweaked calculations for better fit
        # Previous: x=34.6%, y=14.9%, w=30.8%, h=66.8%
        # Adjusting to fit iPhone notch/corners better.
        
        x = int(W * 0.348) # Shift right slightly
        y = int(H * 0.151) # Shift down slightly
        w = int(W * 0.304) # Slightly narrower
        h = int(H * 0.664) # Slightly shorter
        
        # Increase corner radius significantly to match modern iPhone
        radius = int(w * 0.14) 

        # Resize overlay to fit the screen area
        resized_overlay = overlay_img.resize((w, h), Image.Resampling.LANCZOS)
        
        mask = Image.new("L", (w, h), 0)
        from PIL import ImageDraw
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle([(0,0), (w, h)], radius=radius, fill=255)
        
        # Paste overlay onto base using the mask
        base_img.paste(resized_overlay, (x, y), mask)
        
        base_img.save(output_path)
        print(f"Successfully saved composite image to {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    compose_image()
