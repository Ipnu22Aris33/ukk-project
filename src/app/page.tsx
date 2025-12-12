import { UserActions } from "@/components/features/UserAction";
import {
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Text,
  Box,
} from "@radix-ui/themes";

export default function Home() {
  return (
    <Container size="3">
      <Flex
        direction="column"
        gap="8"
        align="center"
        justify="center"
        style={{
          minHeight: "100vh",
          padding: "var(--space-8)",
        }}
      >
        {/* Simple Card untuk Demo Theme */}
        <Card
          size="4"
          style={{ maxWidth: 400, width: "100%", textAlign: "center" }}
        >
          <Flex direction="column" gap="6" p="6">
            <Heading size="8" weight="bold">
              Hello World!
            </Heading>

            <Text size="4" color="gray">
              Ini demo Radix Themes dengan system dark mode.
              <br />
              Coba ubah dark/light mode di sistem OS-mu!
            </Text>

            {/* Demo Buttons dengan Variants */}
            <Flex direction="column" gap="3">
              <Button size="3" variant="solid">
                Solid Button
              </Button>

              <Button size="3" variant="outline">
                Outline Button
              </Button>

              <Button size="3" variant="soft">
                Soft Button
              </Button>

              <Button size="3" variant="ghost">
                Ghost Button
              </Button>
            </Flex>

            {/* Color Palette Demo */}
            <Flex gap="2" justify="center" wrap="wrap">
              {["violet", "blue", "green", "orange", "red"].map((color) => (
                <Box
                  key={color}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: `var(--${color}-9)`,
                    borderRadius: "var(--radius-2)",
                  }}
                  title={`${color} color`}
                />
              ))}
            </Flex>

            {/* Status Text */}
            <Text size="2" color="gray">
              Sistem dalam mode: <Text weight="bold">Auto-detect</Text>
            </Text>
          </Flex>
        </Card>

        {/* Simple Info */}
        <Text size="2" color="gray" align="center">
          Background dan warna akan otomatis menyesuaikan dengan sistem OS.
        </Text>
        <UserActions/>
      </Flex>
    </Container>
  );
}
