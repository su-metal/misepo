import os

path = r'f:\App_dev\misepo\src\components\features\generator\MobilePostInput.tsx'
with open(path, 'rb') as f:
    content = f.read().decode('utf-8')

# Precise replacement for handleBackStep logic
old_block = """        } else if (mobileStep === 'confirm') {
            setMobileStep('confirm');"""

new_block = """        } else if (mobileStep === 'confirm') {
            setMobileStep('input');"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open(path, 'wb') as f:
        f.write(content.encode('utf-8'))
    print("Successfully updated handleBackStep")
else:
    # Try with different line endings
    old_block_crlf = old_block.replace('\n', '\r\n')
    new_block_crlf = new_block.replace('\n', '\r\n')
    if old_block_crlf in content:
        content = content.replace(old_block_crlf, new_block_crlf)
        with open(path, 'wb') as f:
            f.write(content.encode('utf-8'))
        print("Successfully updated handleBackStep (CRLF)")
    else:
        print("Could not find the target block")
