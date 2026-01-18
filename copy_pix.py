import shutil
import os

src_dir = r"C:\Users\tossy\.gemini\antigravity\brain\f5ad7f97-e991-4659-ac05-cdb69432eda7"
dest_dir = r"f:\App_dev\misepo\public\assets\landing"

files = [
    ("clay_monster_ai_robot_1768616539021.png", "clay_monster_ai.png"),
    ("clay_monster_sns_blobs_1768616552558.png", "clay_monster_sns.png"),
    ("clay_monster_sparkle_star_1768616566819.png", "clay_monster_sparkle.png")
]

for src_name, dest_name in files:
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    try:
        shutil.copy2(src_path, dest_path)
        print(f"Success: {src_name} -> {dest_name}")
    except Exception as e:
        print(f"Error: {e}")
