import asyncio
import argparse
from claude_code_sdk import query, ClaudeCodeOptions
from pathlib import Path

def parse_args():
    parser = argparse.ArgumentParser(description="Claude Code SDK CLI")
    parser.add_argument("prompt", help="The prompt to send to Claude")
    parser.add_argument("--max-turns", type=int, default=300, help="Maximum number of turns (default: 300)")
    parser.add_argument("--system-prompt", default="You are a helpful assistant", help="System prompt (default: 'You are a helpful assistant')")
    parser.add_argument("--cwd", default="/app/source", help="Working directory (default: '/app/source')")
    parser.add_argument("--permission-mode", default="acceptEdits", help="Permission mode (default: 'acceptEdits')")
    return parser.parse_args()

async def main(prompt, max_turns=3, system_prompt="You are a helpful assistant that can make changes to files.", cwd="/app/source", permission_mode="acceptEdits"):
    options = ClaudeCodeOptions(
        max_turns=max_turns,
        system_prompt=system_prompt,
        cwd=Path(cwd),  # Can be string or Path
        allowed_tools=["Read", "Edit", "Write", "Bash"],
        permission_mode=permission_mode
    )

    async for message in query(prompt=prompt, options=options):
        print(message)

if __name__ == "__main__":
    args = parse_args()
    asyncio.run(main(
        prompt=args.prompt,
        max_turns=args.max_turns,
        system_prompt=args.system_prompt,
        cwd=args.cwd,
        permission_mode=args.permission_mode
    ))
