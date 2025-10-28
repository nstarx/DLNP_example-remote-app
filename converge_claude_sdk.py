import argparse
import asyncio
import os
import sys
from datetime import datetime
from pathlib import Path

from claude_code_sdk import ClaudeCodeOptions, query

sys.path.append("..")
from kube_utils import create_configmap_prompt


def parse_args():
    parser = argparse.ArgumentParser(description="Claude Code SDK CLI")
    parser.add_argument("prompt", help="The prompt to send to Claude")
    parser.add_argument(
        "--max-turns",
        type=int,
        default=300,
        help="Maximum number of turns (default: 300)",
    )
    parser.add_argument(
        "--system-prompt",
        default="You are a helpful assistant",
        help="System prompt (default: 'You are a helpful assistant')",
    )
    parser.add_argument(
        "--cwd",
        default="/app/source",
        help="Working directory (default: '/app/source')",
    )
    parser.add_argument(
        "--permission-mode",
        default="acceptEdits",
        help="Permission mode (default: 'acceptEdits')",
    )
    parser.add_argument(
        "--show-cost",
        action="store_true",
        default="true",
        help="Show estimated token usage and cost",
    )
    return parser.parse_args()


async def main(
    prompt,
    max_turns=300,
    system_prompt="",
    cwd="/app/source",
    permission_mode="acceptEdits",
    show_cost=False,
):
    dry_run = os.environ.get("DRY_RUN", "").lower() in ("true", "1", "yes")

    if dry_run:
        print("\n" + "=" * 60)
        print("🔧 DRY-RUN MODE: Claude API call skipped")
        print("=" * 60)
        print(f"Prompt received: {prompt}")
        print(f"Working directory: {cwd}")
        print("\nIn dry-run mode, the following would normally happen:")
        print("  1. Initialize Claude Code SDK")
        print("  2. Send prompt to Claude API")
        print("  3. Process code modifications")
        print("  4. Update files based on Claude's analysis")
        print("\nAll steps SKIPPED to save API costs.")
        print("Container will exit successfully.")
        print("=" * 60 + "\n")
        return

    system_prompt = """
       You are a helpful assistant that edits files while keeping the app runnable with all the cost.
       This is the most important part of the app. To run.
       Use only PrimeIcons (https://primevue.org/icons/) for icons. Do not use left borders on panels.
       Generate enterprise look-and-feel UIs. Generate complex UIs.
       Every button, icon, and clickable UI element must perform an action.
       Allways include a button for documentation or dont remove documentation button.
       """
    options = ClaudeCodeOptions(
        max_turns=max_turns,
        system_prompt=system_prompt,
        cwd=Path(cwd),
        allowed_tools=["Read", "Edit", "Write", "Bash"],
        permission_mode=permission_mode,
    )

    message_count = 0
    start_time = datetime.now()
    estimated_input_tokens = 0
    estimated_output_tokens = 0

    if show_cost:
        input_text = f"{system_prompt}\n{prompt}"
        estimated_input_tokens = len(input_text.split()) * 1.3

    async for message in query(prompt=prompt, options=options):
        message_count += 1
        print(message)

        if show_cost and hasattr(message, "__str__"):
            message_text = str(message)
            estimated_output_tokens += len(message_text.split()) * 1.3

    if show_cost and message_count > 0:
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()

        claude_sonnet_input_price = 3.0 / 1_000_000
        claude_sonnet_output_price = 15.0 / 1_000_000

        estimated_input_cost = estimated_input_tokens * claude_sonnet_input_price
        estimated_output_cost = estimated_output_tokens * claude_sonnet_output_price
        total_estimated_cost = estimated_input_cost + estimated_output_cost

        print(f"\n{'=' * 60}")
        print("CLAUDE CODE SESSION SUMMARY")
        print(f"{'=' * 60}")
        print(f"Duration: {duration:.2f} seconds")
        print(f"Total Messages: {message_count}")
        print("\nESTIMATED TOKEN USAGE:")
        print(f"  Input Tokens:  ~{int(estimated_input_tokens):,} tokens")
        print(f"  Output Tokens: ~{int(estimated_output_tokens):,} tokens")
        print(f"  Total Tokens:  ~{int(estimated_input_tokens + estimated_output_tokens):,} tokens")
        print("\nESTIMATED COST (Claude 3.5 Sonnet pricing):")
        print(f"  Input Cost:  ${estimated_input_cost:.6f}")
        print(f"  Output Cost: ${estimated_output_cost:.6f}")
        print(f"  Total Cost:  ${total_estimated_cost:.6f}")
        print("\nNote: This is an estimate based on word count.")
        print("Actual usage may vary. Use Claude API directly for exact counts.")
        print(f"{'=' * 60}\n")

        create_configmap_prompt(
            prompt,
            {
                "estimated_input_tokens": estimated_input_tokens,
                "estimated_output_tokens": estimated_output_tokens,
                "total_estimated_cost": total_estimated_cost,
                "duration": duration,
            },
        )


if __name__ == "__main__":
    args = parse_args()
    asyncio.run(
        main(
            prompt=args.prompt,
            max_turns=args.max_turns,
            system_prompt=args.system_prompt,
            cwd=args.cwd,
            permission_mode=args.permission_mode,
            show_cost=args.show_cost,
        )
    )
